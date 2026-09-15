import { useState, useEffect } from 'react';
import {
  getPresupuestos,
  createPresupuesto,
  deletePresupuesto,
  reactivarPresupuesto,
} from './services/presupuesto';
import { getClientes } from '../cliente/services/cliente';
import { getUsuarios } from '../usuario/services/usuario';
import { getProductos } from '../producto/services/producto';
import type { Presupuesto } from './types/presupuesto';
import type { Cliente } from '../cliente/types/cliente';
import type { Usuario } from '../usuario/types/usuario';
import type { Producto } from '../producto/types/producto';
import {
  Table,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Card,
  Typography,
  Tag,
  Switch,
  message,
  Popconfirm,
} from 'antd';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const coloresEstado: Record<string, string> = {
  PENDIENTE: 'gold',
  ACEPTADO: 'green',
  RECHAZADO: 'red',
  VENCIDO: 'default',
};

function PresupuestoPage() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchPresupuestos = async () => {
    try {
      const data = await getPresupuestos();
      setPresupuestos(data);
    } catch (error) {
      console.error('Error fetching presupuestos:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const opcionesClientes = clientes.map((cliente) => ({
    value: cliente.id,
    label: `${cliente.nombre} ${cliente.apellido}`,
  }));
  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.id,
    label: `${usuario.nombre} ${usuario.apellido}`,
  }));
  const opcionesProductos = productos.map((producto) => ({
    value: producto.id,
    label: producto.nombre,
  }));

  const [form] = Form.useForm();

  const onFinish = async (values: {
    clienteId: number;
    usuarioId: number;
    detalleItems: { productoId: number; cantidad: number }[];
  }) => {
    try {
      await createPresupuesto(values);
      message.success('Presupuesto creado correctamente');
      form.resetFields();
      fetchPresupuestos();
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
      await deletePresupuesto(id);
      message.success('Presupuesto archivado correctamente');
      fetchPresupuestos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (presupuesto: Presupuesto) => {
    try {
      await reactivarPresupuesto(presupuesto.id);
      message.success('Presupuesto reactivado correctamente');
      fetchPresupuestos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const presupuestosFiltrados = presupuestos.filter(
    (presupuesto) => mostrarArchivados || !presupuesto.archivado,
  );

  return (
    <div>
      <Title level={2}>Presupuestos</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Space>
            <Form.Item
              name="clienteId"
              label="Cliente"
              rules={[{ required: true, message: 'Seleccione un cliente' }]}
            >
              <Select style={{ width: 220 }} options={opcionesClientes} />
            </Form.Item>
            <Form.Item
              name="usuarioId"
              label="Usuario"
              rules={[{ required: true, message: 'Seleccione un usuario' }]}
            >
              <Select style={{ width: 220 }} options={opcionesUsuarios} />
            </Form.Item>
          </Space>

          <Form.List
            name="detalleItems"
            rules={[
              {
                validator: async (_, items) => {
                  if (!items || items.length < 1) {
                    return Promise.reject(
                      new Error('Agregue al menos un producto'),
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, 'productoId']}
                      rules={[{ required: true, message: 'Elija un producto' }]}
                    >
                      <Select
                        style={{ width: 200 }}
                        placeholder="Producto"
                        options={opcionesProductos}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'cantidad']}
                      rules={[{ required: true, message: 'Ingrese cantidad' }]}
                    >
                      <InputNumber min={1} placeholder="Cantidad" />
                    </Form.Item>
                    <Button danger onClick={() => remove(field.name)}>
                      Quitar
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    + Agregar producto
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Generar Presupuesto
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Switch checked={mostrarArchivados} onChange={setMostrarArchivados} />
          <span>Mostrar archivados</span>
        </Space>

        <Table
          dataSource={presupuestosFiltrados}
          rowKey="id"
          columns={[
            {
              title: 'Cliente',
              key: 'cliente',
              render: (_, record: Presupuesto) => {
                const cliente = clientes.find((c) => c.id === record.clienteId);
                return cliente
                  ? `${cliente.nombre} ${cliente.apellido}`
                  : record.clienteId;
              },
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
              title: 'Total',
              dataIndex: 'total',
              key: 'total',
              render: (total: string) => `$${total}`,
            },
            {
              title: 'Estado',
              dataIndex: 'estado',
              key: 'estado',
              render: (estado: string) => (
                <Tag color={coloresEstado[estado] ?? 'default'}>{estado}</Tag>
              ),
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Presupuesto) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este presupuesto?"
                    onConfirm={() => handleReactivar(record)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button icon={<UndoOutlined />}>Reactivar</Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="¿Archivar este presupuesto?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Archivar
                    </Button>
                  </Popconfirm>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default PresupuestoPage;
