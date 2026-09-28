import { filterSelectOption } from '../../utils/filterSelectOption';
import { useEffect, useState } from 'react';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  reactivarUsuario,
} from './services/usuario';
import { getSucursales } from '../sucursal/services/sucursal';
import type { Usuario } from './types/usuario';
import type { Sucursal } from '../sucursal/types/sucursal';
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
  Modal,
} from 'antd';
import type { Rol } from './types/usuario';
import { EditOutlined, DeleteOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);


  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchSucursales = async () => {
    try {
      const data = await getSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error fetching sucursales:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    fetchSucursales();
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

  const opcionesSucursales = sucursales
    .filter((usuario) => !usuario.archivado)
    .map((usuario) => ({
      value: usuario.id,
      label: usuario.nombre,
    }));

  const opcionesRoles = [
    {
      value: 'Administracion',
      label: 'Administración',
    },
    {
      value: 'Vendedor',
      label: 'Vendedor',
    },
  ];

  const onFinish = async (values: {
    nombre: string;
    apellido: string;
    dni: string;
    rol: Rol;
    nombreUsuario: string;
    sucursalId: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateUsuario(editandoId, values);
        message.success('Usuario guardado correctamente');
      } else {
        await createUsuario(values);
        message.success('Usuario creado correctamente');
      }
      cerrarModal();
      fetchUsuarios();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditandoId(usuario.id);
    form.setFieldsValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      dni: usuario.dni,
      rol: usuario.rol,
      nombreUsuario: usuario.nombreUsuario,
      sucursalId: usuario.sucursalId,
    });
    setModalAbierto(true);
  };

  const handleReactivar = async (usuario: Usuario) => {
    try {
      await reactivarUsuario(usuario.id);
      message.success('Usuario reactivado correctamente');
      fetchUsuarios();
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
      await deleteUsuario(id);
      message.success('Usuario archivado correctamente');
      fetchUsuarios();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (usuario) => mostrarArchivados || !usuario.archivado,
  );

  return (
    <div>
      <Title level={2}>Usuarios</Title>
      <Modal
        title={editandoId !== null ? 'Editar usuario' : 'Nuevo usuario'}
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
            rules={[
              { required: true, message: 'Ingrese el DNI' },
              {
                pattern: /^\d{7,8}$/,
                message: 'El DNI debe tener 7 u 8 dígitos',
              },
            ]}
          >
            <Input maxLength={8} inputMode="numeric" />
          </Form.Item>
          <Form.Item
            name="rol"
            label="Rol"
            rules={[{ required: true, message: 'Seleccione un rol' }]}
          >
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label" style={{ width: 200 }} options={opcionesRoles} />
          </Form.Item>
          <Form.Item
            name="nombreUsuario"
            label="NombreUsuario"
            rules={[
              { required: true, message: 'Ingrese el nombre de usuario' },
            ]}
          >
            <Input placeholder="Ej: jPerez" />
          </Form.Item>
          <Form.Item
            name="sucursalId"
            label="Sucursal"
            rules={[{ required: true, message: 'Seleccione una sucursal' }]}
          >
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label" style={{ width: 200 }} options={opcionesSucursales} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={cerrarModal}>Cancelar</Button>
              <Button type="primary" htmlType="submit">

              {editandoId !== null ? 'Guardar cambios' : 'Crear Usuario'}
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
            Nuevo usuario
          </Button>
        </Space>

        <Table
          dataSource={usuariosFiltrados}
          rowKey="id"
          scroll={{ x: 1300 }}
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
              title: 'Rol',
              dataIndex: 'rol',
              key: 'rol',
            },
            {
              title: 'NombreUsuario',
              dataIndex: 'nombreUsuario',
              key: 'nombreUsuario',
            },
            {
              title: 'Sucursal',
              dataIndex: 'sucursalId',
              key: 'sucursalId',
              render: (sucursalId: number) =>
                sucursales.find((c) => c.id === sucursalId)?.nombre ??
                sucursalId,
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Usuario) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este usuario?"
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
                      title="¿Archivar este usuario?"
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

export default UsuarioPage;
