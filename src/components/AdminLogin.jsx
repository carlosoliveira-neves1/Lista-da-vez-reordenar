// src/App.jsx
import { useState, useEffect } from 'react'
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
  { id: '1', nome: 'Marcely', foto: null, status: 'espera', empresa: 'Sucesso', tempoServico: null },
  { id: '2', nome: 'Ariana', foto: null, status: 'espera', empresa: 'Sucesso', tempoServico: null },
  { id: '3', nome: 'Shirley', foto: '/api/placeholder/40/40', status: 'espera', empresa: 'Sucesso', tempoServico: null },
  { id: '4', nome: 'Thalissa', foto: null, status: 'espera', empresa: 'Sucesso', tempoServico: null },
  { id: '5', nome: 'Stefany', foto: '/api/placeholder/40/40', status: 'espera', empresa: 'Sucesso', tempoServico: null },
  { id: '6', nome: 'Luís', foto: '/api/placeholder/40/40', status: 'servico', preferencia: 'Preferência do cliente', tempoServico: new Date(Date.now() - 118 * 60 * 1000) },
  { id: '7', nome: 'Victor', foto: '/api/placeholder/40/40', status: 'fora', empresa: 'Dia finalizado', tempoServico: null },
  { id: '8', nome: 'Hellen', foto: null, status: 'fora', empresa: 'Dia finalizado', tempoServico: null }
]

function VendedorCard({ vendedor, index, onStatusChange }) {
  const getInitials = (nome) =>
    nome.split(' ').map(n => n[0]).join('').toUpperCase()

  const formatTempo = (tempoInicio) => {
    if (!tempoInicio) return null
    const diff = Date.now() - tempoInicio
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
                      <div key={i} className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors" />
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
                      <DropdownMenuItem onClick={() => onStatusChange(vendedor.id, 'espera')} className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" /><span>Em espera</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(vendedor.id, 'servico')} className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4" /><span>Em serviço</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusChange(vendedor.id, 'fora')} className="flex items-center space-x-2">
                        <UserX className="w-4 h-4" /><span>Fora da loja</span>
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
    <div className="flex-1 min-h-96"> Continue...
