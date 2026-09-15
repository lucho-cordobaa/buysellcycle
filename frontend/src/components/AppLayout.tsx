import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';
import {
  TagOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  PushpinOutlined,
  BankOutlined,
  UserOutlined,
  InboxOutlined,
  TeamOutlined,
  ShoppingOutlined,
  SwapOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;

const items = [
  {
    key: 'catalogo',
    label: 'Catálogo',
    type: 'group' as const,
    children: [
      {
        key: '/marcas',
        icon: <TagOutlined />,
        label: <Link to="/marcas">Marcas</Link>,
      },
      {
        key: '/categorias-nivel1',
        icon: <AppstoreOutlined />,
        label: <Link to="/categorias-nivel1">Categorías N1</Link>,
      },
      {
        key: '/categorias-nivel2',
        icon: <BarsOutlined />,
        label: <Link to="/categorias-nivel2">Categorías N2</Link>,
      },
      {
        key: '/productos',
        icon: <ShoppingOutlined />,
        label: <Link to="/productos">Productos</Link>,
      },
    ],
  },
  {
    key: 'geografia',
    label: 'Geografía',
    type: 'group' as const,
    children: [
      {
        key: '/provincias',
        icon: <EnvironmentOutlined />,
        label: <Link to="/provincias">Provincias</Link>,
      },
      {
        key: '/localidades',
        icon: <PushpinOutlined />,
        label: <Link to="/localidades">Localidades</Link>,
      },
    ],
  },
  {
    key: 'comercial',
    label: 'Comercial',
    type: 'group' as const,
    children: [
      {
        key: '/clientes',
        icon: <UserOutlined />,
        label: <Link to="/clientes">Clientes</Link>,
      },
      {
        key: '/proveedores',
        icon: <ShopOutlined />,
        label: <Link to="/proveedores">Proveedores</Link>,
      },
      {
        key: '/presupuestos',
        icon: <FileTextOutlined />,
        label: <Link to="/presupuestos">Presupuestos</Link>,
      },
    ],
  },
  {
    key: 'operaciones',
    label: 'Operaciones',
    type: 'group' as const,
    children: [
      {
        key: '/sucursales',
        icon: <BankOutlined />,
        label: <Link to="/sucursales">Sucursales</Link>,
      },
      {
        key: '/depositos',
        icon: <InboxOutlined />,
        label: <Link to="/depositos">Depósitos</Link>,
      },
      {
        key: '/usuarios',
        icon: <TeamOutlined />,
        label: <Link to="/usuarios">Usuarios</Link>,
      },
      {
        key: '/stock',
        icon: <SwapOutlined />,
        label: <Link to="/stock">Stock</Link>,
      },
    ],
  },
];

function AppLayout() {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '20px 0',
          }}
        >
          BuySellCycle
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }} />
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
