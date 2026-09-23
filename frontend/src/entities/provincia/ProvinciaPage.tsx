import { useEffect, useState } from 'react';
import {
  createProvincia,
  deleteProvincia,
  updateProvincia,
  reactivarProvincia,
} from './services/provincia';
import type { Provincia } from './types/provincia';
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
  Grid,
} from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useProvinciaStore } from '../../store/provinciaStore';

const { Title } = Typography;

const { useBreakpoint } = Grid;

function ProvinciasPage() {
  const provincias = useProvinciaStore((state) => state.provincias);
  const cargarProvincias = useProvinciaStore((state) => state.cargarProvincias);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const screens = useBreakpoint();

  useEffect(() => {
    void cargarProvincias().catch((error: unknown) => {
      console.error('Error fetching provincias:', error);
    });
  }, [cargarProvincias]);

  const [form] = Form.useForm();

  const onFinish = async (values: { nombre: string }) => {
    try {
      if (editandoId !== null) {
        await updateProvincia(editandoId, values);
        message.success('Provincia guardada correctamente');
      } else {
        await createProvincia(values);
        message.success('Provincia creada correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      await cargarProvincias();
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
      await deleteProvincia(id);
      message.success('Provincia archivada correctamente');
      await cargarProvincias();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (provincia: Provincia) => {
    try {
      await reactivarProvincia(provincia.id);
      message.success('Provincia reactivada correctamente');
      await cargarProvincias();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (provincia: Provincia) => {
    setEditandoId(provincia.id);
    form.setFieldsValue({ nombre: provincia.nombre });
  };

  const provinciasFiltradas = provincias.filter(
    (provincia) => mostrarArchivados || !provincia.archivado,
  );

  return (
    <div>
      <Title level={2}>Provincias</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          onFinish={onFinish}
          layout={screens.xs ? 'vertical' : 'inline'}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              {
                required: true,
                message: 'Por favor, ingrese el nombre de la provincia',
              },
            ]}
          >
            <Input placeholder="Ej: Santa Fe" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Provinica'}
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
          dataSource={provinciasFiltradas}
          scroll={{ x: 700 }}
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
              render: (_, record: Provincia) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar esta provincia?"
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
                      title="¿Archivar esta provincia?"
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

export default ProvinciasPage;
