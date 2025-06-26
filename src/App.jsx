import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu.jsx'
import { Menu, Settings, Users, BarChart3, MoreVertical, Clock, UserCheck, UserX, Shield } from 'lucide-react'
import AdminLogin from './components/AdminLogin.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import './App.css'

// Dados de exemplo dos vendedores
const initialVendedores = [
  {
    id: '1',
    nome: 'Marcely',
    foto: null,
    status: 'espera',
    empresa: 'Sucesso',
    tempoServico: null
  },
  {
    id: '2',
    nome: 'Ariana',
    foto: null,
    status: 'espera',
    empresa: 'Sucesso',
    tempoServico: null
  },
  {
    id: '3',
    nome: 'Shirley',
    foto: '/api/placeholder/40/40',
    status: 'espera',
    empresa: 'Sucesso',
    tempoServico: null
  },
  {
    id: '4',
    nome: 'Thalissa',
    foto: null,
    status: 'espera',
    empresa: 'Sucesso',
    tempoServico: null
  },
  {
    id: '5',
    nome: 'Stefany',
    foto: '/api/placeholder/40/40',
    status: 'espera',
    empresa: 'Sucesso',
    tempoServico: null
  },
  {
    id: '6',
    nome: 'Luís',
    foto: '/api/placeholder/40/40',
    status: 'servico',
    preferencia: 'Preferência do cliente',
    tempoServico: new Date(Date.now() - 118 * 60 * 1000) // 1h58min atrás
  },
  {
    id: '7',
    nome: 'Victor',
    foto: '/api/placeholder/40/40',
    status: 'fora',
    empresa: 'Dia finalizado',
    tempoServico: null
  },
  {
    id: '8',
    nome: 'Hellen',
    foto: null,
    status: 'fora',
    empresa: 'Dia finalizado',
    tempoServico: null
  }
]

function VendedorCard({ vendedor, index, onStatusChange }) {
  const getInitials = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTempo = (tempoInicio) => {
    if (!tempoInicio) return null
    const agora = new Date()
    const diff = agora - tempoInicio
    const horas = Math.floor(diff / (1000 * 60 * 60))
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
  }

  return (
    <Draggable draggableId={vendedor.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'opacity-75' : ''}`}
        >
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-2 h-8">
                  <div className="grid grid-cols-2 gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors"></div>
                    ))}
                  </div>
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={vendedor.foto} alt={vendedor.nome} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {getInitials(vendedor.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{vendedor.nome}</h3>
                  <p className="text-sm text-gray-500">
                    {vendedor.preferencia || vendedor.empresa}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {vendedor.status === 'servico' && vendedor.tempoServico && (
                    <Badge variant="secondary" className="text-xs">
                      {formatTempo(vendedor.tempoServico)}
                    </Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(vendedor.id, 'espera')}
                        className="flex items-center space-x-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Em espera</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(vendedor.id, 'servico')}
                        className="flex items-center space-x-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Em serviço</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onStatusChange(vendedor.id, 'fora')}
                        className="flex items-center space-x-2"
                      >
                        <UserX className="w-4 h-4" />
                        <span>Fora da loja</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

function StatusColumn({ title, vendedores, droppableId, onStatusChange }) {
  const getColumnIcon = () => {
    switch (droppableId) {
      case 'espera': return <Clock className="w-5 h-5 text-blue-600" />
      case 'servico': return <UserCheck className="w-5 h-5 text-green-600" />
      case 'fora': return <UserX className="w-5 h-5 text-gray-600" />
      default: return null
    }
  }

  return (
    <div className="flex-1 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getColumnIcon()}
          <h2 className="text-lg font-medium text-gray-900">
            {title} ({vendedores.length})
          </h2>
        </div>
        {droppableId === 'espera' && (
          <Button variant="ghost" size="sm" className="text-blue-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        )}
      </div>
      
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-32 p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-transparent'
            }`}
          >
            {vendedores.map((vendedor, index) => (
              <VendedorCard 
                key={vendedor.id} 
                vendedor={vendedor} 
                index={index}
                onStatusChange={onStatusChange}
              />
            ))}
            {provided.placeholder}
            
            {vendedores.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum vendedor nesta lista</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

function App() {
  const [vendedores, setVendedores] = useState(initialVendedores)
  const [activeTab, setActiveTab] = useState('lista')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Atualizar status do vendedor baseado na coluna de destino
    const novoStatus = destination.droppableId
    handleStatusChange(draggableId, novoStatus)
  }

  const handleStatusChange = (vendedorId, novoStatus) => {
    setVendedores(prev => prev.map(vendedor => {
      if (vendedor.id === vendedorId) {
        const vendedorAtualizado = { 
          ...vendedor, 
          status: novoStatus 
        }
        
        // Se mudou para "em serviço", registrar tempo de início
        if (novoStatus === 'servico' && vendedor.status !== 'servico') {
          vendedorAtualizado.tempoServico = new Date()
        }
        // Se saiu de "em serviço", limpar tempo
        else if (novoStatus !== 'servico') {
          vendedorAtualizado.tempoServico = null
        }
        
        return vendedorAtualizado
      }
      return vendedor
    }))
  }

  const handleAdminAccess = () => {
    setIsAdmin(true)
  }

  const handleAdminLogin = (success) => {
    if (success) {
      setIsLoggedIn(true)
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setIsLoggedIn(false)
  }

  // Se está no modo admin mas não logado, mostrar tela de login
  if (isAdmin && !isLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  // Se está logado como admin, mostrar painel administrativo
  if (isAdmin && isLoggedIn) {
    return (
      <AdminPanel 
        vendedores={vendedores}
        onVendedoresChange={setVendedores}
        onLogout={handleAdminLogout}
      />
    )
  }

  const vendedoresEspera = vendedores.filter(v => v.status === 'espera')
  const vendedoresServico = vendedores.filter(v => v.status === 'servico')
  const vendedoresFora = vendedores.filter(v => v.status === 'fora')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Lista da Vez</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleAdminAccess}>
              <Shield className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white border-b border-gray-200 rounded-none h-12 px-4">
          <TabsTrigger value="lista" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Lista da Vez</span>
          </TabsTrigger>
          <TabsTrigger value="campanhas" className="flex items-center space-x-2">
            <span>Campanhas</span>
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Rankings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusColumn 
                  title="Lista de espera"
                  vendedores={vendedoresEspera}
                  droppableId="espera"
                  onStatusChange={handleStatusChange}
                />
                
                <StatusColumn 
                  title="Em serviço"
                  vendedores={vendedoresServico}
                  droppableId="servico"
                  onStatusChange={handleStatusChange}
                />
                
                <StatusColumn 
                  title="Fora da loja"
                  vendedores={vendedoresFora}
                  droppableId="fora"
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="campanhas" className="mt-0">
          <div className="p-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Campanhas</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="mt-0">
          <div className="p-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Rankings</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App

