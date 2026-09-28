import { useEffect, useState } from 'react';
import {
  getProveedores,
  createProveedor,
  deleteProveedor,
  updateProveedor,
  reactivarProveedor,
} from './services/proveedor';
import type { Proveedor } from './types/proveedor';
import {
  Table,
  Form,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Tag,
  Switch,
  message,
  Popconfirm,
  Modal,
} from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

function ProveedorPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);


  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const [form] = Form.useForm();

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
    form.resetFields();
  };

  const handleNueva = () => {
    setEditandoId(null);
    form.resetFields();
    setModalAbierto(true);
  };

  const onFinish = async (values: { razonSocial: string; cuit: string }) => {
    try {
      if (editandoId !== null) {
        await updateProveedor(editandoId, values);
        message.success('Proveedor guardado correctamente');
      } else {
        await createProveedor(values);
        message.success('Proveedor creado correctamente');
      }
      cerrarModal();
      fetchProveedores();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProveedor(id);
      message.success('Proveedor archivado correctamente');
      fetchProveedores();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (proveedor: Proveedor) => {
    try {
      await reactivarProveedor(proveedor.id);
      message.success('Proveedor reactivado correctamente');
      fetchProveedores();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const proveedoresFiltrados = proveedores.filter(
    (proveedor) => mostrarArchivados || !proveedor.archivado,
  );

  const handleEdit = (proveedor: Proveedor) => {
    setEditandoId(proveedor.id);
    form.setFieldsValue({
      razonSocial: proveedor.razonSocial,
      cuit: proveedor.cuit,
    });
    setModalAbierto(true);
  };

  return (
    <div>
      <Title level={2}>Proveedores</Title>
      <Modal
        title={editandoId !== null ? 'Editar proveedor' : 'Nuevo proveedor'}
        open={modalAbierto}
        onCancel={cerrarModal}
        footer={null}
        forceRender
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="razonSocial"
            label="RazonSocial"
            rules={[
              {
                required: true,
                message: 'Por favor, ingrese la razon social del proveedor',
              },
            ]}
          >
            <Input placeholder="Ej: Distibuidora" />
          </Form.Item>
          <Form.Item
            name="cuit"
            label="Cuit"
            rules={[
              {
                required: true,
                message: 'Por favor, ingrese el cuit del proveedor',
              },
              {
                pattern: /^\d{2}-\d{8}-\d$/,
                message: 'El CUIT debe tener el formato XX-XXXXXXXX-X',
              },
            ]}
          >
            <Input placeholder="Ej: 12-34567891-2" maxLength={13} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={cerrarModal}>Cancelar</Button>
              <Button type="primary" htmlType="submit">

              {editandoId !== null ? 'Guardar cambios' : 'Crear Proveedor'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Card>
        <Space
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
          }}
          wrap
        >
          <Space>
            <Switch checked={mostrarArchivados} onChange={setMostrarArchivados} />
            <span>Mostrar archivados</span>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNueva}>
            Nuevo proveedor
          </Button>
        </Space>

        <Table
          dataSource={proveedoresFiltrados}
          rowKey="id"
          scroll={{ x: 800 }}
          columns={[
            {
              title: 'RazonSocial',
              dataIndex: 'razonSocial',
              key: 'razonSocial',
            },
            ...(mostrarArchivados
              ? [
                  {
                    title: 'Estado',
                    dataIndex: 'archivado',
                    key: 'archivado',
                    render: (archivado: boolean) => (
                      <Tag color={archivado ? 'red' : 'green'}>
                        {archivado ? 'Archivado' : 'Activo'}
                      </Tag>
                    ),
                  },
                ]
              : []),
            {
              title: 'Cuit',
              dataIndex: 'cuit',
              key: 'cuit',
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Proveedor) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este proveedor?"
                    onConfirm={() => handleReactivar(record)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button icon={<UndoOutlined />}>Reactivar</Button>
                  </Popconfirm>
                ) : (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(record)}
                    >
                      Editar
                    </Button>
                    <Popconfirm
                      title="¿Archivar este proveedor?"
                      onConfirm={() => handleDelete(record.id)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Archivar
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default ProveedorPage;
