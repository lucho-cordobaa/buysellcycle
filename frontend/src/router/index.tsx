import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MarcasPage from '../entities/marca';
import CategoriaNivel2Page from '../entities/categoria-nivel2';
import CategoriaNivel1Page from '../entities/categoria-nivel1';
import ProveedorPage from '../entities/proveedor';
import SucursalPage from '../entities/sucursal';
import ClientePage from '../entities/cliente';
import DepositoPage from '../entities/deposito';
import UsuarioPage from '../entities/usuario';
import ProductoPage from '../entities/producto';
import StockProductoDepositoPage from '../entities/stock-producto-deposito';
import PresupuestoPage from '../entities/presupuesto';
import AppLayout from '../components/AppLayout';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/marcas" />} />
          <Route path="marcas" element={<MarcasPage />} />
          <Route path="categorias-nivel2" element={<CategoriaNivel2Page />} />
          <Route path="categorias-nivel1" element={<CategoriaNivel1Page />} />
          <Route path="proveedores" element={<ProveedorPage />} />
          <Route path="provincias" element={<Navigate to="/clientes" replace />} />
          <Route path="localidades" element={<Navigate to="/clientes" replace />} />
          <Route path="sucursales" element={<SucursalPage />} />
          <Route path="clientes" element={<ClientePage />} />
          <Route path="depositos" element={<DepositoPage />} />
          <Route path="usuarios" element={<UsuarioPage />} />
          <Route path="productos" element={<ProductoPage />} />
          <Route path="stock" element={<StockProductoDepositoPage />} />
          <Route path="presupuestos" element={<PresupuestoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
