import { useEffect, useState } from 'react';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  reactivarProducto,
} from './services/producto';
import { getMarcas } from '../marca/services/marca';
import { getCategoriasNivel2 } from '../categoria-nivel2/services/categoria-nivel2';
import type { Producto } from './types/producto';
import type { Marca } from '../marca/types/marca';
import type { CategoriaNivel2 } from '../categoria-nivel2/types/categoria-nivel2';
import {
  Table,
  Form,
  Select,
  Input,
  Button,
  Space,
  InputNumber,
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

function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<CategoriaNivel2[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const fetchMarcas = async () => {
    try {
      const data = await getMarcas();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await getCategoriasNivel2();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    fetchMarcas();
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const [form] = Form.useForm();

  const opcionesMarcas = marcas.map((producto) => ({
    value: producto.id,
    label: producto.nombre,
  }));

  const opcionesCategorias = categorias.map((producto) => ({
    value: producto.id,
    label: producto.nombre,
  }));

  const onFinish = async (values: {
    nombre: string;
    costoNeto: number;
    utilidad: number;
    descuentoContado: number;
    marcaId: number;
    categoriaNivel2Id: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateProducto(editandoId, values);
        message.success('Producto guardado correctamente');
      } else {
        await createProducto(values);
        message.success('Producto creado correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchProductos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditandoId(producto.id);
    form.setFieldsValue({
      nombre: producto.nombre,
      costoNeto: producto.costoNeto,
      utilidad: producto.utilidad,
      descuentoContado: producto.descuentoContado,
      marcaId: producto.marcaId,
      categoriaNivel2Id: producto.categoriaNivel2Id,
    });
  };

  const handleReactivar = async (producto: Producto) => {
    try {
      await reactivarProducto(producto.id);
      message.success('Producto reactivado correctamente');
      fetchProductos();
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
      await deleteProducto(id);
      message.success('Producto archivado correctamente');
      fetchProductos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const productosFiltrados = productos.filter(
    (producto) => mostrarArchivados || !producto.archivado,
  );

  return (
    <div>
      <Title level={2}>Productos</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Zapatilla Running" />
          </Form.Item>
          <Form.Item
            name="costoNeto"
            label="CostoNeto"
            rules={[{ required: true, message: 'Ingrese el costo neto' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="utilidad"
            label="Utilidad"
            rules={[{ required: true, message: 'Ingrese la utilidad' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="descuentoContado"
            label="DescuentoContado"
            rules={[
              { required: true, message: 'Ingrese el descuento contado' },
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="marcaId"
            label="Marca"
            rules={[{ required: true, message: 'Seleccione una marca' }]}
          >
            <Select
              style={{ width: 200 }}
              options={opcionesMarcas}
              onChange={() => {
                form.setFieldValue('localidadId', undefined);
              }}
            />
          </Form.Item>
          <Form.Item
            name="categoriaNivel2Id"
            label="Categoria"
            rules={[{ required: true, message: 'Seleccione una categoria' }]}
          >
            <Select style={{ width: 200 }} options={opcionesCategorias} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Producto'}
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
          dataSource={productosFiltrados}
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
              title: 'CostoNeto',
              dataIndex: 'costoNeto',
              key: 'costoNeto',
            },
            {
              title: 'Utilidad',
              dataIndex: 'utilidad',
              key: 'utilidad',
            },
            {
              title: 'DescuentoContado',
              dataIndex: 'descuentoContado',
              key: 'descuentoContado',
            },
            {
              title: 'Marca',
              dataIndex: 'marcaId',
              key: 'marcaId',
              render: (marcaId: number) =>
                marcas.find((c) => c.id === marcaId)?.nombre ?? marcaId,
            },
            {
              title: 'Categoria',
              dataIndex: 'categoriaNivel2Id',
              key: 'categoriaNivel2Id',
              render: (categoriaNivel2Id: number) =>
                categorias.find((c) => c.id === categoriaNivel2Id)?.nombre ??
                categoriaNivel2Id,
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Producto) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este producto?"
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
                      title="¿Archivar este producto?"
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

export default ProductoPage;
