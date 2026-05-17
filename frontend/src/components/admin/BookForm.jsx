
import React, { useState, useEffect, useRef } from 'react';

const BookForm = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '', 
    author: '', 
    price: '', 
    stock: '', 
    description: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price?.toString() || '',
        stock: book.stock?.toString() || '',
        description: book.description || '',
      });
      setPreview(book.image || null);
    } else {
      resetForm();
    }
  }, [book]);

  const resetForm = () => {
    setFormData({ title: '', author: '', price: '', stock: '', description: '' });
    setPreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const targetWidth = 300;
        const targetHeight = 450;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        const offsetX = (targetWidth - newWidth) / 2;
        const offsetY = (targetHeight - newHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        setPreview(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const bookToSave = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
    };

    onSave(bookToSave, selectedFile, preview);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div 
        className="modal-content animate-slideDown"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{book ? 'Редагувати книгу' : 'Додати нову книгу'}</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="modal-body overflow-y-auto max-h-[70vh] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Обкладинка книги
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center">
                {preview ? (
                  <div className="relative mx-auto w-48 h-64 mb-6">
                    <img 
                      src={preview} 
                      alt="preview" 
                      className="w-full h-full object-cover rounded-2xl shadow-md border border-gray-200"
                    />
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="py-12">
                    <p className="text-gray-500">Завантажте обкладинку книги</p>
                  </div>
                )}

                <label className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl cursor-pointer transition font-medium">
                  {preview ? 'Змінити фото' : 'Вибрати файл'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Назва книги</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))} 
                required 
                placeholder="Назва книги" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Автор</label>
              <input 
                type="text" 
                name="author" 
                value={formData.author} 
                onChange={(e) => setFormData(prev => ({...prev, author: e.target.value}))} 
                required 
                placeholder="Автор книги" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ціна (₴)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))} 
                  required 
                  min="0" 
                  step="0.01" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Кількість на складі</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))} 
                  required 
                  min="0" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Короткий опис</label>
              <textarea 
                name="description"
                value={formData.description} 
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                rows="5"
                placeholder="Короткий опис книги..."
                className="resize-y min-h-[120px] w-full"
              />
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </form>
        </div>

        <div className="modal-footer border-t">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-4 text-gray-700 font-medium border border-gray-300 rounded-2xl hover:bg-gray-50"
          >
            Скасувати
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-2xl"
          >
            {book ? 'Зберегти зміни' : 'Додати книгу'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookForm;