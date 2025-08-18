import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-10 pt-8 pb-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">MutluGünüm Giriş</h2>

        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="ornek@eposta.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
          >
            Giriş Yap
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="text-pink-600 hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
