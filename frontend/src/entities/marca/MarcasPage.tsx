import { useEffect, useState } from 'react';
import {
  getMarcas,
  createMarca,
  deleteMarca,
  updateMarca,
  reactivarMarca,
} from './services/marca';
import type { Marca } from './types/marca';
import {
  Table,
  Form,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Tag,
  Popconfirm,
  Switch,
  message,
} from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchMarcas = async () => {
    try {
      const data = await getMarcas();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values: { nombre: string }) => {
    try {
      if (editandoId !== null) {
        await updateMarca(editandoId, values.nombre);
        message.success('Marca guardada correctamente');
      } else {
        await createMarca(values.nombre);
        message.success('Marca creada correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchMarcas();
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
      await deleteMarca(id);
      message.success('Marca archivada correctamente');
      fetchMarcas();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (marca: Marca) => {
    try {
      await reactivarMarca(marca.id);
      message.success('Marca reactivada correctamente');
      fetchMarcas();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (marca: Marca) => {
    setEditandoId(marca.id);
    form.setFieldsValue({ nombre: marca.nombre });
  };

  const marcasFiltradas = marcas.filter(
    (marca) => mostrarArchivados || !marca.archivado,
  );

  return (
    <div>
      <Title level={2}>Marcas</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              {
                required: true,
                message: 'Por favor, ingrese el nombre',
              },
            ]}
          >
            <Input placeholder="Ej: Adidas" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Marca'}
            </Button>
          </Form.Item>
          {editandoId !== null && (
            <Form.Item>
              <Button
                onClick={() => {
                  setEditandoId(null);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Switch checked={mostrarArchivados} onChange={setMostrarArchivados} />
          <span>Mostrar archivados</span>
        </Space>

        <Table
          dataSource={marcasFiltradas}
          rowKey="id"
          columns={[
            {
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
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
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Marca) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar esta marca?"
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
                      title="¿Archivar esta marca?"
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

export default MarcasPage;
