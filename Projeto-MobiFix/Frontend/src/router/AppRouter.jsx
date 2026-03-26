import { BrowserRouter, Routes, Route } from 'react-router-dom'

function TestPage() {
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold text-green-700">Router está a funcionar</h1>
      <p className="mt-4 text-lg text-slate-700">Teste simples com BrowserRouter.</p>
    </div>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}