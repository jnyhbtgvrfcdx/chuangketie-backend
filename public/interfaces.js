const state = {
  groups: [],
  interfaces: [],
  search: '',
  activeGroup: 'all',
  activeMethod: 'ALL',
  currentTestItem: null,
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
  testModal: document.getElementById('testModal'),
};

const METHOD_ORDER = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];

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

  // 点击遮罩层关闭弹窗
  elements.testModal.addEventListener('click', (e) => {
    if (e.target === elements.testModal) {
      closeTestModal();
    }
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
    const matchesMethod = state.activeMethod === 'ALL' || item.method === item.activeMethod;
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
  const copyLinkBtn = fragment.querySelector('.copy-link');
  const testApiBtn = fragment.querySelector('.test-api');
  const testResult = fragment.querySelector('.test-result');

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

  // 复制链接功能
  copyLinkBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${item.path}`;
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      copyLinkBtn.innerHTML = '<span class="btn-icon">✅</span> 已复制';
      setTimeout(() => {
        copyLinkBtn.innerHTML = '<span class="btn-icon">📋</span> 复制链接';
      }, 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      copyLinkBtn.innerHTML = '<span class="btn-icon">✅</span> 已复制';
      setTimeout(() => {
        copyLinkBtn.innerHTML = '<span class="btn-icon">📋</span> 复制链接';
      }, 2000);
    }
  });

  // 测试接口功能 - 打开弹窗
  testApiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openTestModal(item, testResult);
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

// ==================== 测试弹窗功能 ====================

function openTestModal(item, testResultEl) {
  state.currentTestItem = item;
  state.testResultEl = testResultEl;

  document.getElementById('modalPath').textContent = item.path;
  document.getElementById('modalMethod').textContent = item.method;
  document.getElementById('modalMethod').className = `method-tag ${item.method.toLowerCase()}`;

  // 路径参数输入
  const pathParamsSection = document.getElementById('pathParamsSection');
  const pathParamsInputs = document.getElementById('pathParamsInputs');
  
  if (item.pathParams && item.pathParams.length > 0) {
    pathParamsSection.style.display = 'block';
    pathParamsInputs.innerHTML = item.pathParams.map(param => `
      <div class="param-input-group">
        <label>${param.name}${param.required ? ' <span class="required">*</span>' : ''}</label>
        <input type="text" data-param-type="path" data-param-name="${param.name}" 
               placeholder="${param.description}" class="param-input" />
      </div>
    `).join('');
  } else {
    pathParamsSection.style.display = 'none';
  }

  // 查询参数输入
  const queryParamsSection = document.getElementById('queryParamsSection');
  const queryParamsInputs = document.getElementById('queryParamsInputs');
  
  if (item.queryParams && item.queryParams.length > 0) {
    queryParamsSection.style.display = 'block';
    queryParamsInputs.innerHTML = item.queryParams.map(param => `
      <div class="param-input-group">
        <label>${param.name}${param.required ? ' <span class="required">*</span>' : ''}</label>
        <input type="text" data-param-type="query" data-param-name="${param.name}" 
               placeholder="${param.description}" class="param-input" />
      </div>
    `).join('');
  } else {
    queryParamsSection.style.display = 'none';
  }

  // 请求体输入
  const bodySection = document.getElementById('bodySection');
  const bodyInput = document.getElementById('bodyInput');
  
  if (['POST', 'PUT'].includes(item.method) && item.requestBodyExample) {
    bodySection.style.display = 'block';
    bodyInput.value = JSON.stringify(item.requestBodyExample, null, 2);
  } else if (['POST', 'PUT'].includes(item.method)) {
    bodySection.style.display = 'block';
    bodyInput.value = '{\n  \n}';
  } else {
    bodySection.style.display = 'none';
  }

  // 认证 Token 输入
  const authSection = document.getElementById('authSection');
  
  if (item.authRequired) {
    authSection.style.display = 'block';
    document.getElementById('authTokenInput').value = 'mock-token-test-user';
  } else {
    authSection.style.display = 'none';
  }

  // 显示弹窗
  elements.testModal.style.display = 'flex';
}

function closeTestModal() {
  elements.testModal.style.display = 'none';
  state.currentTestItem = null;
}

async function executeTest() {
  const item = state.currentTestItem;
  if (!item) return;

  const testResultEl = state.testResultEl;
  
  // 收集路径参数
  let finalPath = item.path;
  const pathInputs = document.querySelectorAll('[data-param-type="path"]');
  pathInputs.forEach(input => {
    const paramName = input.getAttribute('data-param-name');
    const paramValue = input.value || 'test-id';
    finalPath = finalPath.replace(`:${paramName}`, paramValue);
  });

  // 收集查询参数
  const queryParams = [];
  const queryInputs = document.querySelectorAll('[data-param-type="query"]');
  queryInputs.forEach(input => {
    const paramName = input.getAttribute('data-param-name');
    const paramValue = input.value;
    if (paramValue) {
      queryParams.push(`${paramName}=${encodeURIComponent(paramValue)}`);
    }
  });
  
  if (queryParams.length > 0) {
    finalPath += '?' + queryParams.join('&');
  }

  // 收集请求体
  let requestBody = null;
  if (['POST', 'PUT'].includes(item.method)) {
    const bodyInput = document.getElementById('bodyInput').value.trim();
    if (bodyInput) {
      try {
        requestBody = JSON.parse(bodyInput);
      } catch (e) {
        alert('请求体 JSON 格式错误：' + e.message);
        return;
      }
    }
  }

  // 收集认证 Token
  const authSection = document.getElementById('authSection');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authSection.style.display !== 'none') {
    const token = document.getElementById('authTokenInput').value.trim();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 关闭弹窗
  closeTestModal();

  // 显示测试中状态
  testResultEl.style.display = 'block';
  testResultEl.className = 'test-result testing';
  testResultEl.innerHTML = '<span class="loading">⏳</span> 正在测试接口...';

  const startTime = Date.now();

  try {
    const options = {
      method: item.method,
      headers,
    };

    if (requestBody) {
      options.body = JSON.stringify(requestBody);
    }

    const response = await fetch(finalPath, options);
    const endTime = Date.now();
    const duration = endTime - startTime;

    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (response.ok) {
      testResultEl.className = 'test-result success';
      testResultEl.innerHTML = `
        <div class="test-header">
          <span class="status-icon">✅</span>
          <span class="status-text">接口可用</span>
          <span class="duration">${duration}ms</span>
        </div>
        <div class="test-detail">
          <div class="detail-row">
            <span class="label">请求路径：</span>
            <code class="value">${finalPath}</code>
          </div>
          <div class="detail-row">
            <span class="label">状态码：</span>
            <span class="value status-${response.status}">${response.status} ${response.statusText}</span>
          </div>
          <div class="detail-row">
            <span class="label">响应数据：</span>
            <pre class="response-preview">${typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData}</pre>
          </div>
        </div>
      `;
    } else {
      testResultEl.className = 'test-result warning';
      testResultEl.innerHTML = `
        <div class="test-header">
          <span class="status-icon">⚠️</span>
          <span class="status-text">接口返回错误</span>
          <span class="duration">${duration}ms</span>
        </div>
        <div class="test-detail">
          <div class="detail-row">
            <span class="label">请求路径：</span>
            <code class="value">${finalPath}</code>
          </div>
          <div class="detail-row">
            <span class="label">状态码：</span>
            <span class="value status-${response.status}">${response.status} ${response.statusText}</span>
          </div>
          <div class="detail-row">
            <span class="label">响应数据：</span>
            <pre class="response-preview">${typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData}</pre>
          </div>
        </div>
      `;
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    testResultEl.className = 'test-result error';
    testResultEl.innerHTML = `
      <div class="test-header">
        <span class="status-icon">❌</span>
        <span class="status-text">接口不可用</span>
        <span class="duration">${duration}ms</span>
      </div>
      <div class="test-detail">
        <div class="detail-row">
          <span class="label">请求路径：</span>
          <code class="value">${finalPath}</code>
        </div>
        <div class="detail-row">
          <span class="label">错误信息：</span>
          <span class="value error-msg">${error.message}</span>
        </div>
        <div class="detail-row">
          <span class="label">可能原因：</span>
          <span class="value">网络错误、服务器未启动或接口不存在</span>
        </div>
      </div>
    `;
  }
}

// 暴露全局函数给 HTML 调用
window.closeTestModal = closeTestModal;
window.executeTest = executeTest;

bootstrap();
