import { useEffect, useState } from 'react';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  reactivarCliente,
} from './services/cliente';
import { getProvincias } from '../provincia/services/provincia';
import { getLocalidades } from '../localidad/services/localidad';
import type { Cliente } from './types/cliente';
import type { Provincia } from '../provincia/types/provincia';
import type { Localidad } from '../localidad/types/localidad';
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

function ClientePage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const fetchProvincias = async () => {
    try {
      const data = await getProvincias();
      setProvincias(data);
    } catch (error) {
      console.error('Error fetching provincias:', error);
    }
  };

  const fetchLocalidades = async () => {
    try {
      const data = await getLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error('Error fetching localidad:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    fetchProvincias();
  }, []);

  useEffect(() => {
    fetchLocalidades();
  }, []);

  const [form] = Form.useForm();

  const opcionesProvincias = provincias.map((sucursal) => ({
    value: sucursal.id,
    label: sucursal.nombre,
  }));

  const provinciaSeleccionada = Form.useWatch('provinciaId', form);

  const opcionesLocalidades = localidades
    .filter((localidad) => localidad.provinciaId === provinciaSeleccionada)
    .map((localidad) => ({ value: localidad.id, label: localidad.nombre }));

  const onFinish = async (values: {
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    provinciaId: number;
    localidadId: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateCliente(editandoId, values);
        message.success('Cliente guardado correctamente');
      } else {
        await createCliente(values);
        message.success('Cliente creado correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchClientes();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditandoId(cliente.id);
    form.setFieldsValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      dni: cliente.dni,
      email: cliente.email,
      provinciaId: cliente.provinciaId,
      localidadId: cliente.localidadId,
    });
  };

  const handleReactivar = async (cliente: Cliente) => {
    try {
      await reactivarCliente(cliente.id);
      message.success('Cliente reactivado correctamente');
      fetchClientes();
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
      await deleteCliente(id);
      message.success('Cliente archivado correctamente');
      fetchClientes();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const clientesFiltrados = clientes.filter(
    (cliente) => mostrarArchivados || !cliente.archivado,
  );

  return (
    <div>
      <Title level={2}>Clientes</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Juan" />
          </Form.Item>
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: 'Ingrese el apellido' }]}
          >
            <Input placeholder="Ej: Perez" />
          </Form.Item>
          <Form.Item
            name="dni"
            label="Dni"
            rules={[{ required: true, message: 'Ingrese el dni' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Ingrese el email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provinciaId"
            label="Provincia"
            rules={[{ required: true, message: 'Seleccione una provincia' }]}
          >
            <Select
              style={{ width: 200 }}
              options={opcionesProvincias}
              onChange={() => {
                form.setFieldValue('localidadId', undefined);
              }}
            />
          </Form.Item>
          <Form.Item
            name="localidadId"
            label="Localidad"
            rules={[{ required: true, message: 'Seleccione una localidad' }]}
          >
            <Select
              style={{ width: 200 }}
              options={opcionesLocalidades}
              disabled={!provinciaSeleccionada}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Cliente'}
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
          dataSource={clientesFiltrados}
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
              title: 'Apellido',
              dataIndex: 'apellido',
              key: 'apellido',
            },
            {
              title: 'Dni',
              dataIndex: 'dni',
              key: 'dni',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Provincia',
              dataIndex: 'provinciaId',
              key: 'provinciaId',
              render: (provinciaId: number) =>
                provincias.find((c) => c.id === provinciaId)?.nombre ??
                provinciaId,
            },
            {
              title: 'Localidad',
              dataIndex: 'localidadId',
              key: 'localidadId',
              render: (localidadId: number) =>
                localidades.find((c) => c.id === localidadId)?.nombre ??
                localidadId,
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Cliente) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este cliente?"
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
                      title="¿Archivar este cliente?"
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

export default ClientePage;
