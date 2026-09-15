import { useEffect, useState } from 'react';
import {
  getDepositos,
  createDeposito,
  updateDeposito,
  deleteDeposito,
  reactivarDeposito,
} from './services/deposito';
import { getProvincias } from '../provincia/services/provincia';
import { getLocalidades } from '../localidad/services/localidad';
import type { Deposito } from './types/deposito';
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

function DepositoPage() {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const fetchDepositos = async () => {
    try {
      const data = await getDepositos();
      setDepositos(data);
    } catch (error) {
      console.error('Error fetching depositos:', error);
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
    fetchDepositos();
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
    codigo: string;
    nombre: string;
    provinciaId: number;
    localidadId: number;
  }) => {
    try {
      if (editandoId !== null) {
        await updateDeposito(editandoId, values);
        message.success('Deposito guardado correctamente');
      } else {
        await createDeposito(values);
        message.success('Deposito creado correctamente');
      }
      setEditandoId(null);
      form.resetFields();
      fetchDepositos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleEdit = (deposito: Deposito) => {
    setEditandoId(deposito.id);
    form.setFieldsValue({
      codigo: deposito.codigo,
      nombre: deposito.nombre,
      provinciaId: deposito.provinciaId,
      localidadId: deposito.localidadId,
    });
  };

  const handleReactivar = async (deposito: Deposito) => {
    try {
      await reactivarDeposito(deposito.id);
      message.success('Deposito reactivado correctamente');
      fetchDepositos();
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
      await deleteDeposito(id);
      message.success('Deposito archivado correctamente');
      fetchDepositos();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const depositosFiltrados = depositos.filter(
    (deposito) => mostrarArchivados || !deposito.archivado,
  );

  return (
    <div>
      <Title level={2}>Depósitos</Title>
      <Card style={{ marginBottom: 24 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item
            name="codigo"
            label="Codigo"
            rules={[{ required: true, message: 'Ingrese el codigo' }]}
          >
            <Input placeholder="Ej: DEP-01" />
          </Form.Item>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Ej: Depósito central" />
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
              {editandoId !== null ? 'Guardar cambios' : 'Crear Deposito'}
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
          dataSource={depositosFiltrados}
          rowKey="id"
          columns={[
            {
              title: 'Codigo',
              dataIndex: 'codigo',
              key: 'codigo',
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
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
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
              render: (_, record: Deposito) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este deposito?"
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
                      title="¿Archivar este deposito?"
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

export default DepositoPage;
