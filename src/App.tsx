import React, { useState } from 'react';
import { Menu, X, Home, Code2, Users, Settings, ChevronRight, Plus, Trash2, Edit, Save, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface APIParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface API {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: APIParameter[];
  responseExample?: string;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apis, setApis] = useState<API[]>([
    {
      id: '1',
      name: '获取用户列表',
      endpoint: '/api/users',
      method: 'GET',
      description: '获取系统中所有用户的列表',
      parameters: [
        {
          id: '1-1',
          name: 'page',
          type: 'number',
          required: true,
          description: '页码',
          defaultValue: '1'
        },
        {
          id: '1-2',
          name: 'limit',
          type: 'number',
          required: false,
          description: '每页数量',
          defaultValue: '10'
        }
      ],
      responseExample: '{\n  "users": [],\n  "total": 0\n}'
    },
    {
      id: '2',
      name: '创建新用户',
      endpoint: '/api/users',
      method: 'POST',
      description: '在系统中创建新用户',
      parameters: [
        {
          id: '2-1',
          name: 'username',
          type: 'string',
          required: true,
          description: '用户名'
        },
        {
          id: '2-2',
          name: 'email',
          type: 'string',
          required: true,
          description: '邮箱地址'
        }
      ],
      responseExample: '{\n  "id": "user_id",\n  "username": "string"\n}'
    }
  ]);
  const [editingApi, setEditingApi] = useState<API | null>(null);
  const [newApi, setNewApi] = useState<Partial<API>>({
    method: 'GET',
    parameters: []
  });
  const [newParameter, setNewParameter] = useState<Partial<APIParameter>>({
    type: 'string',
    required: false
  });

  const menuItems = [
    { icon: Home, label: '主页', id: 'dashboard', active: activeTab === 'dashboard' },
    { icon: Code2, label: 'API管理', id: 'apis', active: activeTab === 'apis' },
    { icon: Users, label: '用户管理', id: 'users', active: activeTab === 'users' },
    { icon: Settings, label: '设置', id: 'settings', active: activeTab === 'settings' },
  ];

  const stats = [
    { label: 'API总数', value: apis.length.toString(), change: '+2.5%' },
    { label: 'API调用次数', value: '147,521', change: '+23.1%' },
    { label: '成功率', value: '99.24%', change: '+0.3%' },
    { label: '平均响应时间', value: '245ms', change: '-18.7%' },
  ];

  const handleCreateApi = () => {
    if (!newApi.name || !newApi.endpoint || !newApi.method || !newApi.description) {
      toast.error('请填写所有必填字段');
      return;
    }

    const api: API = {
      id: Date.now().toString(),
      name: newApi.name,
      endpoint: newApi.endpoint,
      method: newApi.method,
      description: newApi.description,
      parameters: newApi.parameters || [],
      responseExample: newApi.responseExample
    };

    setApis([...apis, api]);
    setNewApi({ method: 'GET', parameters: [] });
    toast.success('API创建成功');
  };

  const handleAddParameter = () => {
    if (!newParameter.name || !newParameter.type) {
      toast.error('请填写参数名称和类型');
      return;
    }

    const parameter: APIParameter = {
      id: Date.now().toString(),
      name: newParameter.name,
      type: newParameter.type as APIParameter['type'],
      required: newParameter.required || false,
      description: newParameter.description || '',
      defaultValue: newParameter.defaultValue
    };

    if (editingApi) {
      setEditingApi({
        ...editingApi,
        parameters: [...editingApi.parameters, parameter]
      });
    } else {
      setNewApi({
        ...newApi,
        parameters: [...(newApi.parameters || []), parameter]
      });
    }

    setNewParameter({ type: 'string', required: false });
    toast.success('参数添加成功');
  };

  const handleDeleteParameter = (parameterId: string) => {
    if (editingApi) {
      setEditingApi({
        ...editingApi,
        parameters: editingApi.parameters.filter(p => p.id !== parameterId)
      });
    } else {
      setNewApi({
        ...newApi,
        parameters: (newApi.parameters || []).filter(p => p.id !== parameterId)
      });
    }
    toast.success('参数删除成功');
  };

  const handleUpdateApi = () => {
    if (!editingApi) return;
    
    setApis(apis.map(api => api.id === editingApi.id ? editingApi : api));
    setEditingApi(null);
    toast.success('API更新成功');
  };

  const handleDeleteApi = (id: string) => {
    setApis(apis.filter(api => api.id !== id));
    toast.success('API删除成功');
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors[method as keyof typeof colors];
  };

  const ParameterForm = ({ isEditing = false }) => {
    const currentParameters = isEditing ? editingApi?.parameters : newApi.parameters || [];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">参数名称</label>
            <input
              type="text"
              value={newParameter.name || ''}
              onChange={(e) => setNewParameter({ ...newParameter, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="参数名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">参数类型</label>
            <select
              value={newParameter.type}
              onChange={(e) => setNewParameter({ ...newParameter, type: e.target.value as APIParameter['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">默认值</label>
            <input
              type="text"
              value={newParameter.defaultValue || ''}
              onChange={(e) => setNewParameter({ ...newParameter, defaultValue: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="默认值"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">描述</label>
            <input
              type="text"
              value={newParameter.description || ''}
              onChange={(e) => setNewParameter({ ...newParameter, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="参数描述"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newParameter.required || false}
              onChange={(e) => setNewParameter({ ...newParameter, required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">必需参数</span>
          </label>
          <button
            onClick={handleAddParameter}
            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus size={16} className="mr-1" />
            添加参数
          </button>
        </div>

        {/* Parameters List */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">已添加的参数</h4>
          <div className="space-y-2">
            {currentParameters.map((param) => (
              <div key={param.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">{param.name}</span>
                  <span className="text-xs text-gray-500">{param.type}</span>
                  {param.required && (
                    <span className="flex items-center text-xs text-red-600">
                      <AlertCircle size={12} className="mr-1" />
                      必需
                    </span>
                  )}
                  {param.defaultValue && (
                    <span className="text-xs text-gray-500">默认值: {param.defaultValue}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteParameter(param.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`font-bold text-xl text-gray-800 ${!sidebarOpen && 'hidden'}`}>
            API管理系统
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">API管理系统</h2>
            <p className="text-gray-600">管理和监控您的API</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </p>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">最近活动</h3>
                  <button className="text-blue-600 hover:text-blue-700 flex items-center">
                    查看全部
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">API更新完成</p>
                          <p className="text-sm text-gray-500">
                            系统已完成API更新和优化
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">2小时前</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-6">
              {/* Create New API Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">创建新API</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API名称</label>
                    <input
                      type="text"
                      value={newApi.name || ''}
                      onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="输入API名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">端点</label>
                    <input
                      type="text"
                      value={newApi.endpoint || ''}
                      onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="/api/resource"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">请求方法</label>
                    <select
                      value={newApi.method || 'GET'}
                      onChange={(e) => setNewApi({ ...newApi, method: e.target.value as API['method'] })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">描述</label>
                    <input
                      type="text"
                      value={newApi.description || ''}
                      onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="API描述"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">响应示例</label>
                  <textarea
                    value={newApi.responseExample || ''}
                    onChange={(e) => setNewApi({ ...newApi, responseExample: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    placeholder="{\n  'key': 'value'\n}"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">API参数</h4>
                  <ParameterForm />
                </div>

                <button
                  onClick={handleCreateApi}
                  className="mt-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  创建API
                </button>
              </div>

              {/* API List */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API列表</h3>
                <div className="space-y-4">
                  {apis.map((api) => (
                    <div key={api.id} className="border rounded-lg p-4">
                      {editingApi?.id === api.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={editingApi.name}
                              onChange={(e) => setEditingApi({ ...editingApi, name: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={editingApi.endpoint}
                              onChange={(e) => setEditingApi({ ...editingApi, endpoint: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <select
                              value={editingApi.method}
                              onChange={(e) => setEditingApi({ ...editingApi, method: e.target.value as API['method'] })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                            </select>
                            <input
                              type="text"
                              value={editingApi.description}
                              onChange={(e) => setEditingApi({ ...editingApi, description: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">响应示例</label>
                            <textarea
                              value={editingApi.responseExample || ''}
                              onChange={(e) => setEditingApi({ ...editingApi, responseExample: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows={4}
                            />
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-4">API参数</h4>
                            <ParameterForm isEditing />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleUpdateApi}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save size={16} className="mr-1" />
                              保存
                            </button>
                            <button
                              onClick={() => setEditingApi(null)}
                              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{api.name}</h4>
                              <p className="text-sm text-gray-500">{api.description}</p>
                              <div className="flex items-center mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(api.method)}`}>
                                  {api.method}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">{api.endpoint}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingApi(api)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteApi(api.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Parameters Preview */}
                          {api.parameters.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">API参数</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {api.parameters.map((param) => (
                                  <div key={param.id} className="text-sm bg-gray-50 p-2 rounded">
                                    <span className="font-medium">{param.name}</span>
                                    <span className="text-gray-500 ml-2">({param.type})</span>
                                    {param.required && (
                                      <span className="text-red-500 ml-2">*</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Response Example Preview */}
                          {api.responseExample && (
                            <div className="mt-4 border-t pt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">响应示例</h5>
                              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                                {api.responseExample}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;