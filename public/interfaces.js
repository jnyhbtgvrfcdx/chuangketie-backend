const state = {
  groups: [],
  interfaces: [],
  search: '',
  activeGroup: 'all',
  activeMethod: 'ALL',
};

const elements = {
  statusBanner: document.getElementById('statusBanner'),
  interfaceSections: document.getElementById('interfaceSections'),
  interfaceCount: document.getElementById('interfaceCount'),
  groupCount: document.getElementById('groupCount'),
  authCount: document.getElementById('authCount'),
  searchInput: document.getElementById('searchInput'),
  groupFilters: document.getElementById('groupFilters'),
  methodFilters: document.getElementById('methodFilters'),
  interfaceCardTemplate: document.getElementById('interfaceCardTemplate'),
};

const METHOD_ORDER = ['ALL', 'GET', 'POST', 'DELETE'];

async function bootstrap() {
  bindEvents();

  try {
    const response = await fetch('/api/docs/interfaces');
    const payload = await response.json();

    if (!response.ok || payload.code !== 0) {
      throw new Error(payload.message || '接口数据加载失败');
    }

    state.groups = payload.data.groups || [];
    state.interfaces = payload.data.interfaces || [];

    renderFilters();
    render();
  } catch (error) {
    elements.statusBanner.textContent = error.message;
    elements.statusBanner.classList.add('error');
  }
}

function bindEvents() {
  elements.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });
}

function renderFilters() {
  renderChipGroup(elements.groupFilters, [
    { label: '全部模块', value: 'all' },
    ...state.groups.map((group) => ({ label: group.title, value: group.key })),
  ], state.activeGroup, (value) => {
    state.activeGroup = value;
    renderFilters();
    render();
  });

  renderChipGroup(elements.methodFilters, METHOD_ORDER.map((method) => ({ label: method, value: method })), state.activeMethod, (value) => {
    state.activeMethod = value;
    renderFilters();
    render();
  });
}

function renderChipGroup(container, items, activeValue, onClick) {
  container.innerHTML = '';

  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-chip${item.value === activeValue ? ' active' : ''}`;
    button.textContent = item.label;
    button.addEventListener('click', () => onClick(item.value));
    container.appendChild(button);
  });
}

function getFilteredInterfaces() {
  return state.interfaces.filter((item) => {
    const matchesGroup = state.activeGroup === 'all' || item.group === state.activeGroup;
    const matchesMethod = state.activeMethod === 'ALL' || item.method === state.activeMethod;
    const matchesSearch = !state.search || [item.title, item.path, item.method, item.group, item.description]
      .join(' ')
      .toLowerCase()
      .includes(state.search);

    return matchesGroup && matchesMethod && matchesSearch;
  });
}

function render() {
  const filteredInterfaces = getFilteredInterfaces();
  const visibleGroups = state.groups
    .map((group) => ({
      ...group,
      interfaces: filteredInterfaces.filter((item) => item.group === group.key),
    }))
    .filter((group) => group.interfaces.length > 0);

  elements.interfaceCount.textContent = String(filteredInterfaces.length);
  elements.groupCount.textContent = String(visibleGroups.length);
  elements.authCount.textContent = String(filteredInterfaces.filter((item) => item.authRequired).length);
  elements.statusBanner.textContent = `共找到 ${filteredInterfaces.length} 个接口，分布在 ${visibleGroups.length} 个模块。`;
  elements.statusBanner.classList.remove('error');
  elements.interfaceSections.innerHTML = '';

  if (!filteredInterfaces.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = '没有匹配的接口，试试更换筛选条件。';
    elements.interfaceSections.appendChild(emptyState);
    return;
  }

  visibleGroups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'interface-group';

    const header = document.createElement('div');
    header.className = 'group-header';
    header.innerHTML = `
      <div class="group-title-wrap">
        <h3>${group.title}</h3>
        <p class="group-description">${group.description || ''}</p>
      </div>
      <span class="group-count">${group.interfaces.length} 个接口</span>
    `;

    const list = document.createElement('div');
    list.className = 'group-list';
    group.interfaces.forEach((item) => list.appendChild(createInterfaceCard(item)));

    section.appendChild(header);
    section.appendChild(list);
    elements.interfaceSections.appendChild(section);
  });
}

function createInterfaceCard(item) {
  const fragment = elements.interfaceCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.interface-card');
  const summaryButton = fragment.querySelector('.interface-summary');
  const methodBadge = fragment.querySelector('.method-badge');
  const title = fragment.querySelector('.interface-title');
  const path = fragment.querySelector('.interface-path');
  const authPill = fragment.querySelector('.auth-pill');
  const description = fragment.querySelector('.interface-description');
  const pathParams = fragment.querySelector('.path-params');
  const queryParams = fragment.querySelector('.query-params');
  const authText = fragment.querySelector('.auth-text');
  const bodyBlock = fragment.querySelector('.body-block');
  const requestBody = fragment.querySelector('.request-body');
  const responseNotes = fragment.querySelector('.response-notes');

  methodBadge.textContent = item.method;
  methodBadge.classList.add(item.method.toLowerCase());
  title.textContent = item.title;
  path.textContent = item.path;
  authPill.textContent = item.authRequired ? '需要鉴权' : '公开接口';
  authPill.classList.add(item.authRequired ? 'protected' : 'public');
  description.textContent = item.description;
  authText.textContent = item.authRequired
    ? item.authHint || '需要在请求头中附带 Bearer token。'
    : '无需鉴权，可直接调用。';
  responseNotes.textContent = item.responseNotes || '无额外说明。';

  fillDetailList(pathParams, item.pathParams, '无路径参数');
  fillDetailList(queryParams, item.queryParams, '无查询参数');

  if (item.requestBodyExample) {
    requestBody.textContent = JSON.stringify(item.requestBodyExample, null, 2);
  } else {
    bodyBlock.style.display = 'none';
  }

  summaryButton.addEventListener('click', () => {
    card.classList.toggle('open');
  });

  return fragment;
}

function fillDetailList(listElement, items, emptyText) {
  listElement.innerHTML = '';

  if (!items || !items.length) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = emptyText;
    listElement.appendChild(emptyItem);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.name}${item.required ? '（必填）' : '（可选）'}：${item.description}`;
    listElement.appendChild(li);
  });
}

bootstrap();
