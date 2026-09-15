import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import MarcasPage from '../pages/MarcasPage';
import CategoriaNivel2Page from '../pages/CategoriaNivel2Page';
import CategoriaNivel1Page from '../pages/CategoriaNivel1Page';
import ProveedorPage from '../pages/ProveedorPage';
import ProvinciasPage from '../pages/ProvinciaPage';
import LocalidadesPage from '../pages/LocalidadPage';
import SucursalPage from '../pages/SucursalPage';
import ClientePage from '../pages/ClientePage';
import DepositoPage from '../pages/DepositoPage';
import UsuarioPage from '../pages/UsuarioPage';
import ProductoPage from '../pages/ProductoPage';
import StockProductoDepositoPage from '../pages/StockProductoDepositoPage';
import PresupuestoPage from '../pages/PresupuestoPage';
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
          <Route path="provincias" element={<ProvinciasPage />} />
          <Route path="localidades" element={<LocalidadesPage />} />
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
