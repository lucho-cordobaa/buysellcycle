import { useEffect, useState } from 'react';
import {
  getLocalidades,
  createLocalidad,
  updateLocalidad,
  deleteLocalidad,
  reactivarLocalidad,
} from './services/localidad';
import { getProvincias } from '../provincia/services/provincia';
import type { Localidad } from './types/localidad';
import type { Provincia } from '../provincia/types/provincia';
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

function LocalidadesPage() {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchLocalidades = async () => {
    try {
      const data = await getLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error('Error fetching localidades:', error);
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

  useEffect(() => {
    fetchLocalidades();
  }, []);

  useEffect(() => {
    fetchProvincias();
  }, []);

  const [form] = Form.useForm();

  const opcionesProvincias = provincias.map((localidad) => ({
    value: localidad.id,
    label: localidad.nombre,
  }));

  const onFinish = async (values: { nombre: string; provinciaId: number }) => {
    try {
      if (editandoId !== null) {
        await updateLocalidad(editandoId, values);
        message.success('Localidad guardada correctamente');
      } else {
        await createLocalidad(values);
        message.success('Localidad creada correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchLocalidades();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (localidad: Localidad) => {
    setEditandoId(localidad.id);
    form.setFieldsValue({
      nombre: localidad.nombre,
      provinciaId: localidad.provinciaId,
    });
  };

  const handleReactivar = async (localidad: Localidad) => {
    try {
      await reactivarLocalidad(localidad.id);
      message.success('Localidad reactivada correctamente');
      fetchLocalidades();
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
      await deleteLocalidad(id);
      message.success('Localidad archivada correctamente');
      fetchLocalidades();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const localidadesFiltradas = localidades.filter(
    (localidad) => mostrarArchivados || !localidad.archivado,
  );

  return (
    <div>
      <Title level={2}>Localidades</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Rafaela" />
          </Form.Item>
          <Form.Item
            name="provinciaId"
            label="Provincia"
            rules={[{ required: true, message: 'Seleccione una provincia' }]}
          >
            <Select style={{ width: 200 }} options={opcionesProvincias} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Localidad'}
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
          dataSource={localidadesFiltradas}
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
              title: 'Provincia',
              dataIndex: 'provinciaId',
              key: 'provinciaId',
              render: (provinciaId: number) =>
                provincias.find((c) => c.id === provinciaId)?.nombre ??
                provinciaId,
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: Localidad) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar esta localidad?"
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
                      title="¿Archivar esta localidad?"
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

export default LocalidadesPage;
