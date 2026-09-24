import { filterSelectOption } from '../../utils/filterSelectOption';
import { useState, useEffect } from 'react';
import {
  getStockProductoDepositos,
  updateStockProductoDeposito,
  deleteStockProductoDeposito,
  ingresarStock,
  egresoStock,
  transferirStock,
  reactivarStockProductoDeposito,
} from './services/stock-producto-deposito';
import { getDepositos } from '../deposito/services/deposito';
import { getProductos } from '../producto/services/producto';
import type { StockProductoDeposito } from './types/stock-producto-deposito';
import type { Deposito } from '../deposito/types/deposito';
import type { Producto } from '../producto/types/producto';
import {
  Table,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  Tabs,
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

function StockProductoDepositoPage() {
  const [stocks, setStocks] = useState<StockProductoDeposito[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  const screens = useBreakpoint();

  const fetchStocks = async () => {
    try {
      const data = await getStockProductoDepositos();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchDepositos = async () => {
    try {
      const data = await getDepositos();
      setDepositos(data);
    } catch (error) {
      console.error('Error fetching depositos:', error);
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
    fetchStocks();
  }, []);

  useEffect(() => {
    fetchDepositos();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const opcionesDepositos = depositos
    .filter((deposito) => !deposito.archivado)
    .map((deposito) => ({
      value: deposito.id,
      label: deposito.nombre,
    }));
  const opcionesProductos = productos
    .filter((producto) => !producto.archivado)
    .map((producto) => ({
      value: producto.id,
      label: producto.nombre,
    }));

  const [formIngreso] = Form.useForm();
  const onFinishIngreso = async (values: {
    depositoId: number;
    productoId: number;
    cantidad: number;
  }) => {
    if (!Number.isInteger(values.cantidad) || values.cantidad <= 0) {
      message.error('La cantidad debe ser un entero positivo');
      return;
    }
    try {
      await ingresarStock(values);
      message.success('Stock ingresado correctamente');
      formIngreso.resetFields();
      fetchStocks();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const [formEgreso] = Form.useForm();
  const onFinishEgreso = async (values: {
    depositoId: number;
    productoId: number;
    cantidad: number;
  }) => {
    if (!Number.isInteger(values.cantidad) || values.cantidad <= 0) {
      message.error('La cantidad debe ser un entero positivo');
      return;
    }
    try {
      await egresoStock(values);
      message.success('Stock egresado correctamente');
      formEgreso.resetFields();
      fetchStocks();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const [formTransferencia] = Form.useForm();
  const onFinishTransferencia = async (values: {
    depositoOrigenId: number;
    depositoDestinoId: number;
    productoId: number;
    cantidad: number;
  }) => {
    if (!Number.isInteger(values.cantidad) || values.cantidad <= 0) {
      message.error('La cantidad debe ser un entero positivo');
      return;
    }
    try {
      await transferirStock(values);
      message.success('Stock transferido correctamente');
      formTransferencia.resetFields();
      fetchStocks();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const depositoSeleccionadoEgreso = Form.useWatch('depositoId', formEgreso);
  const productosDelDepositoEgreso = stocks
    .filter((s) => s.depositoId === depositoSeleccionadoEgreso && !s.archivado)
    .map((s) => productos.find((p) => p.id === s.productoId))
    .filter((producto): producto is Producto => producto !== undefined);

  const opcionesProductosEgreso = productosDelDepositoEgreso
    .filter((producto) => !producto.archivado)
    .map((producto) => ({
      value: producto.id,
      label: producto.nombre,
    }));

  const depositoOrigenSeleccionado = Form.useWatch(
    'depositoOrigenId',
    formTransferencia,
  );
  const productosDelDepositoOrigen = stocks
    .filter((s) => s.depositoId === depositoOrigenSeleccionado && !s.archivado)
    .map((s) => productos.find((p) => p.id === s.productoId))
    .filter((p): p is Producto => p !== undefined);

  const opcionesProductosTransferencia = productosDelDepositoOrigen
    .filter((p) => !p.archivado)
    .map((p) => ({
      value: p.id,
      label: p.nombre,
    }));

  const [form] = Form.useForm();
  const handleEdit = (stock: StockProductoDeposito) => {
    setEditandoId(stock.id);
    form.setFieldsValue({
      depositoId: stock.depositoId,
      productoId: stock.productoId,
      stock: stock.stock,
    });
  };

  const onFinishEdit = async (values: {
    depositoId: number;
    productoId: number;
    stock: number;
  }) => {
    if (editandoId === null) return;
    try {
      await updateStockProductoDeposito(editandoId, values);
      message.success('Registro guardado correctamente');
      setEditandoId(null);
      form.resetFields();
      fetchStocks();
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
      await deleteStockProductoDeposito(id);
      message.success('Registro archivado correctamente');
      fetchStocks();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const handleReactivar = async (stock: StockProductoDeposito) => {
    try {
      await reactivarStockProductoDeposito(stock.id);
      message.success('Registro reactivado correctamente');
      fetchStocks();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Ocurrió un error inesperado');
      }
    }
  };

  const stocksFiltrados = stocks.filter(
    (stock) => mostrarArchivados || !stock.archivado,
  );

  return (
    <div>
      <Title level={2}>Stock por Depósito</Title>

      <Card style={{ marginBottom: 24 }}>
        <Tabs
          items={[
            {
              key: 'ingreso',
              label: 'Ingreso',
              children: (
                <Form
                  form={formIngreso}
                  onFinish={onFinishIngreso}
                  layout={screens.xs ? 'vertical' : 'inline'}
                >
                  <Form.Item
                    name="depositoId"
                    label="Depósito"
                    rules={[
                      { required: true, message: 'Seleccione un depósito' },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesDepositos}
                    />
                  </Form.Item>
                  <Form.Item
                    name="productoId"
                    label="Producto"
                    rules={[
                      { required: true, message: 'Seleccione un producto' },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesProductos}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cantidad"
                    label="Cantidad"
                    rules={[
                      { required: true, message: 'La cantidad es obligatoria' },
                      {
                        type: 'integer',
                        min: 1,
                        message: 'La cantidad debe ser un entero positivo',
                      },
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Ingresar
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'egreso',
              label: 'Egreso',
              children: (
                <Form
                  form={formEgreso}
                  onFinish={onFinishEgreso}
                  layout="inline"
                >
                  <Form.Item
                    name="depositoId"
                    label="Depósito"
                    rules={[
                      { required: true, message: 'Seleccione un depósito' },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesDepositos}
                      onChange={() =>
                        formEgreso.setFieldValue('productoId', undefined)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="productoId"
                    label="Producto"
                    rules={[
                      { required: true, message: 'Seleccione un producto' },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesProductosEgreso}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cantidad"
                    label="Cantidad"
                    rules={[
                      { required: true, message: 'La cantidad es obligatoria' },
                      {
                        type: 'integer',
                        min: 1,
                        message: 'La cantidad debe ser un entero positivo',
                      },
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" danger htmlType="submit">
                      Egresar
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'transferencia',
              label: 'Transferencia',
              children: (
                <Form
                  form={formTransferencia}
                  onFinish={onFinishTransferencia}
                  layout="inline"
                >
                  <Form.Item
                    name="depositoOrigenId"
                    label="Depósito Origen"
                    rules={[
                      {
                        required: true,
                        message: 'Seleccione un depósito de origen',
                      },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesDepositos}
                      onChange={() =>
                        formTransferencia.setFieldValue('productoId', undefined)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="depositoDestinoId"
                    label="Depósito Destino"
                    rules={[
                      {
                        required: true,
                        message: 'Seleccione un depósito de destino',
                      },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesDepositos}
                    />
                  </Form.Item>
                  <Form.Item
                    name="productoId"
                    label="Producto"
                    rules={[
                      { required: true, message: 'Seleccione un producto' },
                    ]}
                  >
                    <Select filterOption={filterSelectOption} showSearch optionFilterProp="label"
                      style={{ width: 180 }}
                      options={opcionesProductosTransferencia}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cantidad"
                    label="Cantidad"
                    rules={[
                      { required: true, message: 'La cantidad es obligatoria' },
                      {
                        type: 'integer',
                        min: 1,
                        message: 'La cantidad debe ser un entero positivo',
                      },
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Transferir
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Editar registro</Title>
        <Form form={form} onFinish={onFinishEdit} layout="inline">
          <Form.Item
            name="depositoId"
            label="Depósito"
            rules={[{ required: true }]}
          >
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label" style={{ width: 180 }} options={opcionesDepositos} />
          </Form.Item>
          <Form.Item
            name="productoId"
            label="Producto"
            rules={[{ required: true }]}
          >
            <Select filterOption={filterSelectOption} showSearch optionFilterProp="label" style={{ width: 180 }} options={opcionesProductos} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              { required: true, message: 'El stock es obligatorio' },
              {
                type: 'integer',
                min: 1,
                message: 'El stock debe ser positivo',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={editandoId === null}
            >
              Guardar cambios
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
          dataSource={stocksFiltrados}
          rowKey="id"
          scroll={{ x: 1000 }}
          columns={[
            {
              title: 'Depósito',
              dataIndex: 'depositoId',
              key: 'depositoId',
              render: (id: number) =>
                depositos.find((d) => d.id === id)?.nombre ?? id,
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
              title: 'Producto',
              dataIndex: 'productoId',
              key: 'productoId',
              render: (id: number) =>
                productos.find((p) => p.id === id)?.nombre ?? id,
            },
            {
              title: 'Stock',
              dataIndex: 'stock',
              key: 'stock',
            },
            {
              title: 'Acciones',
              key: 'acciones',
              render: (_, record: StockProductoDeposito) =>
                record.archivado ? (
                  <Popconfirm
                    title="¿Reactivar este registro?"
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
                      title="¿Archivar este registro?"
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

export default StockProductoDepositoPage;
