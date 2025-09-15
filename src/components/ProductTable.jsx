import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", quantity: 0 });
  const [saleQuantities, setSaleQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.sku) return;
    
    try {
      await axios.post(`${API}/products`, newProduct);
      setNewProduct({ name: "", sku: "", quantity: 0 });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const getLocalToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


  const recordSale = async (id, channel) => {
    const quantity = saleQuantities[id] || 1;

    try {
      await axios.post(`${API}/sales`, {
        channel,
        date: getLocalToday(),
        items: [{ productId: id, quantity }],
      });
      setSaleQuantities({...saleQuantities, [id]: 1});
      fetchProducts();
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 py-2 border-b border-gray-200">📦 Manage Products</h2>

      {/* Add Product Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Add New Product</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Product Name"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="SKU"
            className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            min="0"
            className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg w-full sm:w-auto transition-colors duration-200 font-medium shadow-sm"
            onClick={addProduct}
            disabled={!newProduct.name || !newProduct.sku}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Add your first product above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Quantity</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Sell</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-700">{p.sku}</td>
                  <td className="px-4 py-3">
                   <td className="px-4 py-2 border">
  <input
    type="number"
    min="0"
    value={p.quantity}
    onChange={(e) => {
      const updatedProducts = products.map((prod) =>
        prod._id === p._id ? { ...prod, quantity: Number(e.target.value) } : prod
      );
      setProducts(updatedProducts);
    }}
    onBlur={async () => {
      // Optional: update when input loses focus
      await axios.put(`${API}/products/${p._id}`, {
        quantity: p.quantity,
      });
      fetchProducts();
    }}
    onKeyDown={async (e) => {
      if (e.key === "Enter") {
        await axios.put(`${API}/products/${p._id}`, {
          quantity: p.quantity,
        });
        fetchProducts();
      }
    }}
    className="border rounded w-20 text-center"
  />
</td>

                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={p.quantity}
                        placeholder="Quantity"
                        className="border border-gray-300 px-3 py-2 w-16 text-center rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={saleQuantities[p._id] || ""}
                        onChange={(e) =>
                          setSaleQuantities({ ...saleQuantities, [p._id]: Number(e.target.value) })
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 shadow-sm whitespace-nowrap"
                          onClick={() => recordSale(p._id, "Amazon")}
                          disabled={p.quantity < (saleQuantities[p._id] || 1)}
                        >
                          Amazon
                        </button>
                      
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200 shadow-sm whitespace-nowrap"
                          onClick={() => recordSale(p._id, "Flipkart")}
                          disabled={p.quantity < (saleQuantities[p._id] || 1)}
                        >
                          Flipkart
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTable;