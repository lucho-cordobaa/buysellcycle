import { useEffect, useState } from 'react';
import {
  getCategoriasNivel2,
  createCategoriaNivel2,
  updateCategoriaNivel2,
  deleteCategoriaNivel2,
  reactivarCategoriaNivel2,
} from './services/categoria-nivel2';
import { getCategoriasNivel1 } from '../categoria-nivel1/services/categoria-nivel1';
import type { CategoriaNivel2 } from './types/categoria-nivel2';
import type { CategoriaNivel1 } from '../categoria-nivel1/types/categoria-nivel1';
import {
  Table,
  Form,
  Select,
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

function CategoriaNivel2Page() {
  const [categorias, setCategorias] = useState<CategoriaNivel2[]>([]);
  const [categoriasNivel1, setCategoriasNivel1] = useState<CategoriaNivel1[]>(
    [],
  );
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchCategorias = async () => {
    try {
      const data = await getCategoriasNivel2();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias nivel 2:', error);
    }
  };

  const fetchCategoriasNivel1 = async () => {
    try {
      const data = await getCategoriasNivel1();
      setCategoriasNivel1(data);
    } catch (error) {
      console.error('Error fetching categorias nivel 1:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchCategoriasNivel1();
  }, []);

  const [form] = Form.useForm();

  const opcionesCategoriaNivel1 = categoriasNivel1
    .filter((categoria) => !categoria.archivado)
    .map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    }));

  const onFinish = async (values: {
    nombre: string;
    categoriaNivel1Id: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateCategoriaNivel2(editandoId, values);
        message.success('Categoria guardada correctamente');
      } else {
        await createCategoriaNivel2(values);
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

  const handleEdit = (categoria: CategoriaNivel2) => {
    setEditandoId(categoria.id);
    form.setFieldsValue({
      nombre: categoria.nombre,
      categoriaNivel1Id: categoria.categoriaNivel1Id,
    });
  };

  const handleReactivar = async (categoria: CategoriaNivel2) => {
    try {
      await reactivarCategoriaNivel2(categoria.id);
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

  const handleDelete = async (id: number) => {
    try {
      await deleteCategoriaNivel2(id);
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

  const categoriasFiltradas = categorias.filter(
    (categorias) => mostrarArchivados || !categorias.archivado,
  );

  return (
    <div>
      <Title level={2}>Categorías Nivel 2</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Zapatillas" />
          </Form.Item>
          <Form.Item
            name="categoriaNivel1Id"
            label="Categoría Nivel 1"
            rules={[{ required: true, message: 'Seleccione una categoría' }]}
          >
            <Select style={{ width: 200 }} options={opcionesCategoriaNivel1} />
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
              title: 'Categoría Nivel 1',
              dataIndex: 'categoriaNivel1Id',
              key: 'categoriaNivel1Id',
              render: (categoriaNivel1Id: number) =>
                categoriasNivel1.find((c) => c.id === categoriaNivel1Id)
                  ?.nombre ?? categoriaNivel1Id,
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: CategoriaNivel2) =>
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

export default CategoriaNivel2Page;
