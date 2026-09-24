import { filterSelectOption } from '../../utils/filterSelectOption';
import { useEffect, useState } from 'react';
import {
  getSucursales,
  createSucursal,
  updateSucursal,
  deleteSucursal,
  reactivarSucursal,
} from './services/sucursal';
import { getProvincias } from '../provincia/services/provincia';
import { getLocalidades } from '../localidad/services/localidad';
import type { Sucursal } from './types/sucursal';
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
  Grid,
} from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const { useBreakpoint } = Grid;

function SucursalPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const screens = useBreakpoint();

  const fetchSucursales = async () => {
    try {
      const data = await getSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error fetching sucursales:', error);
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
      console.error('Error fetching localidades:', error);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  useEffect(() => {
    fetchProvincias();
  }, []);

  useEffect(() => {
    fetchLocalidades();
  }, []);

  const [form] = Form.useForm();

  const opcionesProvincias = provincias
    .filter((provincia) => !provincia.archivado)
    .map((provincia) => ({
      value: provincia.id,
      label: provincia.nombre,
    }));

  const provinciaSeleccionada = Form.useWatch('provinciaId', form);

  const opcionesLocalidades = localidades
    .filter(
      (localidad) =>
        !localidad.archivado &&
        localidad.provinciaId === provinciaSeleccionada,
    )
    .map((localidad) => ({ value: localidad.id, label: localidad.nombre }));

  const onFinish = async (values: {
    nombre: string;
    provinciaId: number;
    localidadId: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateSucursal(editandoId, values);
        message.success('Sucursal guardada correctamente');
      } else {
        await createSucursal(values);
        message.success('Sucursal creada correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchSucursales();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (sucursal: Sucursal) => {
    setEditandoId(sucursal.id);
    form.setFieldsValue({
      nombre: sucursal.nombre,
      provinciaId: sucursal.provinciaId,
      localidadId: sucursal.localidadId,
    });
  };

  const handleReactivar = async (sucursal: Sucursal) => {
    try {
      await reactivarSucursal(sucursal.id);
      message.success('Sucursal reactivada correctamente');
      fetchSucursales();
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
      await deleteSucursal(id);
      message.success('Sucursal archivada correctamente');
      fetchSucursales();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const sucursalesFiltradas = sucursales.filter(
    (sucursal) => mostrarArchivados || !sucursal.archivado,
  );

  return (
    <div>
      <Title level={2}>Sucursales</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          onFinish={onFinish}
          layout={screens.xs ? 'vertical' : 'inline'}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Sucursal Centro" />
          </Form.Item>
          <Form.Item
            name="provinciaId"
            label="Provincia"
            rules={[{ required: true, message: 'Seleccione una provincia' }]}
          >
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
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
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
              style={{ width: 200 }}
              options={opcionesLocalidades}
              disabled={!provinciaSeleccionada}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editandoId !== null ? 'Guardar cambios' : 'Crear Sucursal'}
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
          dataSource={sucursalesFiltradas}
          rowKey="id"
          scroll={{ x: 900 }}
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
              render: (_, record: Sucursal) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar esta sucursal?"
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
                      title="¿Archivar esta sucursal?"
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

export default SucursalPage;
