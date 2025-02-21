import React from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { APIParameter, ParameterType } from '../types';
import toast from 'react-hot-toast';

interface ParameterFormProps {
  parameters: APIParameter[];
  onAddParameter: (parameter: Omit<APIParameter, 'id'>) => void;
  onDeleteParameter: (id: string) => void;
  isEditing?: boolean;
}

export function ParameterForm({
  parameters,
  onAddParameter,
  onDeleteParameter,
  isEditing = false,
}: ParameterFormProps) {
  const [newParameter, setNewParameter] = React.useState<Partial<APIParameter>>({
    type: 'string',
    required: false,
  });

  const handleAddParameter = () => {
    if (!newParameter.name || !newParameter.type) {
      toast.error('请填写参数名称和类型');
      return;
    }

    try {
      onAddParameter({
        name: newParameter.name,
        type: newParameter.type as ParameterType,
        required: newParameter.required || false,
        description: newParameter.description || '',
        defaultValue: newParameter.defaultValue,
        validation: newParameter.validation,
      });

      setNewParameter({ type: 'string', required: false });
      toast.success('参数添加成功');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '添加参数失败');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            onChange={(e) => setNewParameter({ ...newParameter, type: e.target.value as ParameterType })}
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
          <label className="block text-sm font-medium text-gray-700">验证规则</label>
          <input
            type="text"
            value={newParameter.validation || ''}
            onChange={(e) => setNewParameter({ ...newParameter, validation: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="例如: min:1,max:100"
          />
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
        <div className="lg:col-span-2">
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
          {parameters.map((param) => (
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
                {param.validation && (
                  <span className="text-xs text-blue-600">验证: {param.validation}</span>
                )}
                {param.defaultValue && (
                  <span className="text-xs text-gray-500">默认值: {param.defaultValue}</span>
                )}
              </div>
              <button
                onClick={() => onDeleteParameter(param.id)}
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
}