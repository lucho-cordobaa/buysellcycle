import { useEffect, useState } from 'react';
import {
  getCategoriasNivel1,
  createCategoriaNivel1,
  updateCategoriaNivel1,
  deleteCategoriaNivel1,
  reactivarCategoriaNivel1,
} from './services/categoria-nivel1';
import type { CategoriaNivel1 } from './types/categoria-nivel1';
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
} from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

function CategoriaNivel1Page() {
  const [categorias, setCategorias] = useState<CategoriaNivel1[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchCategorias = async () => {
    try {
      const data = await getCategoriasNivel1();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias nivel 1:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values: { nombre: string }) => {
    try {
      if (editandoId !== null) {
        await updateCategoriaNivel1(editandoId, values.nombre);
        message.success('Categoria guardada correctamente');
      } else {
        await createCategoriaNivel1(values.nombre);
        message.success('Categoria creada correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchCategorias();
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
      await deleteCategoriaNivel1(id);
      message.success('Categoria archivada correctamente');
      fetchCategorias();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (categoria: CategoriaNivel1) => {
    try {
      await reactivarCategoriaNivel1(categoria.id);
      message.success('Categoria reactivada correctamente');
      fetchCategorias();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (categoria: CategoriaNivel1) => {
    setEditandoId(categoria.id);
    form.setFieldsValue({ nombre: categoria.nombre });
  };

  const categoriasFiltradas = categorias.filter(
    (categorias) => mostrarArchivados || !categorias.archivado,
  );

  return (
    <div>
      <Title level={2}>Categorías Nivel 1</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              {
                required: true,
                message: 'Por favor, ingrese el nombre de la categoría',
              },
            ]}
          >
            <Input placeholder="Ej: Indumentaria" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Categoría'}
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
          dataSource={categoriasFiltradas}
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
              render: (_, record: CategoriaNivel1) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar esta categoria?"
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
                      title="¿Archivar esta categoría?"
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

export default CategoriaNivel1Page;
