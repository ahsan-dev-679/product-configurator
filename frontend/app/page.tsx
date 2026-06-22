'use client';

import { useEffect, useState } from 'react';
import { api, Product } from './api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [baureiheInput, setBaureiheInput] = useState<{ [key: string]: string }>({});
  const [modelleInput, setModelleInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    try {
      await api.createProduct(newProductName);
      setNewProductName('');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const handleCreateVariant = async (productId: string) => {
    const br = baureiheInput[productId]?.trim();
    const modRaw = modelleInput[productId]?.trim();

    if (!br || !modRaw) {
      setError('Please fill out both Baureihe and Modelle fields.');
      return;
    }

    const modelleArray = modRaw.split(',').map(m => m.trim()).filter(m => m.length > 0);

    try {
      await api.createVariant(productId, [
        { baureihe: br, modelle: modelleArray }
      ]);
      
      setBaureiheInput(prev => ({ ...prev, [productId]: '' }));
      setModelleInput(prev => ({ ...prev, [productId]: '' }));
      setError('');
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create variant');
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '850px', margin: '0 auto', color: '#333' }}>
      <h2 style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem' }}>📦 Product Configurator Dashboard</h2>
      
      <form onSubmit={handleCreateProduct} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: '6px' }}>
        <input
          type="text"
          placeholder="Enter Product Name (e.g., Tankdeckel)"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          style={{ padding: '0.6rem', flex: 1, borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Create Product
        </button>
      </form>

      {error && (
        <div style={{ color: '#d32f2f', background: '#ffebee', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ⚠️ Error: {error}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading configurations...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {products.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No products configured yet.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} style={{ border: '1px solid #e0e0e0', padding: '1.5rem', borderRadius: '8px', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0070f3' }}>{product.name}</h3>
                  <span style={{ background: '#333', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    CODE: {product.code}
                  </span>
                </div>
                
                <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.95rem', color: '#555' }}>Variants ({product.variants.length})</h4>
                {product.variants.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#999', margin: '0 0 1rem 0', fontStyle: 'italic' }}>No variants assigned yet.</p>
                ) : (
                  <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #f0f0f0' }}>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {product.variants.map((v) => (
                        <li key={v.code} style={{ marginBottom: '0.4rem' }}>
                          <span style={{ background: '#e1f5fe', color: '#0288d1', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 'bold', marginRight: '0.5rem' }}>{v.code}</span>
                          {v.assignments.map((a, aIdx) => (
                            <span key={aIdx}>
                              Baureihe: <strong>{a.baureihe}</strong> ➔ Modelle: <em>{a.modelle.join(', ')}</em>
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '1rem', marginTop: '1rem' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>+ Add New Variant Mapping</h5>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Baureihe (e.g. 964)"
                      value={baureiheInput[product._id] || ''}
                      onChange={(e) => setBaureiheInput(prev => ({ ...prev, [product._id]: e.target.value }))}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: '1.5', minWidth: '150px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Modelle (e.g. Coupe, Targa)"
                      value={modelleInput[product._id] || ''}
                      onChange={(e) => setModelleInput(prev => ({ ...prev, [product._id]: e.target.value }))}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', flex: '3', minWidth: '250px', fontSize: '0.85rem' }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleCreateVariant(product._id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                    >
                      Add Variant
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}