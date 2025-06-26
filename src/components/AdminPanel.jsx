import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog.jsx'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Users, 
  MoreVertical,
  Upload,
  Camera
} from 'lucide-react'

function AdminPanel({ vendedores, onVendedoresChange, onLogout }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingVendedor, setEditingVendedor] = useState(null)
  const [newVendedor, setNewVendedor] = useState({
    nome: '',
    empresa: 'Sucesso',
    foto: null
  })

  const getInitials = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'espera': { label: 'Em espera', variant: 'secondary' },
      'servico': { label: 'Em serviço', variant: 'default' },
      'fora': { label: 'Fora da loja', variant: 'outline' }
    }
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' }
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    )
  }

  const handleAddVendedor = () => {
    if (!newVendedor.nome.trim()) return

    const novoVendedor = {
      id: Date.now().toString(),
      nome: newVendedor.nome,
      foto: newVendedor.foto,
      status: 'espera',
      empresa: newVendedor.empresa,
      tempoServico: null
    }

    onVendedoresChange([...vendedores, novoVendedor])
    setNewVendedor({ nome: '', empresa: 'Sucesso', foto: null })
    setIsAddDialogOpen(false)
  }

  const handleEditVendedor = (vendedor) => {
    setEditingVendedor(vendedor)
    setNewVendedor({
      nome: vendedor.nome,
      empresa: vendedor.empresa || 'Sucesso',
      foto: vendedor.foto
    })
  }

  const handleUpdateVendedor = () => {
    if (!newVendedor.nome.trim() || !editingVendedor) return

    const vendedoresAtualizados = vendedores.map(v => 
      v.id === editingVendedor.id 
        ? { ...v, nome: newVendedor.nome, empresa: newVendedor.empresa, foto: newVendedor.foto }
        : v
    )

    onVendedoresChange(vendedoresAtualizados)
    setEditingVendedor(null)
    setNewVendedor({ nome: '', empresa: 'Sucesso', foto: null })
  }

  const handleDeleteVendedor = (vendedorId) => {
    const vendedoresAtualizados = vendedores.filter(v => v.id !== vendedorId)
    onVendedoresChange(vendedoresAtualizados)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewVendedor(prev => ({ ...prev, foto: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-500">Gerenciar vendedores e configurações</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Vendedores</h2>
            <p className="text-sm text-gray-500">
              Total de {vendedores.length} vendedores cadastrados
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vendedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Vendedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do vendedor"
                    value={newVendedor.nome}
                    onChange={(e) => setNewVendedor(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa/Setor</Label>
                  <Input
                    id="empresa"
                    placeholder="Ex: Sucesso, Vendas, etc."
                    value={newVendedor.empresa}
                    onChange={(e) => setNewVendedor(prev => ({ ...prev, empresa: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Foto do Vendedor</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={newVendedor.foto} />
                      <AvatarFallback>
                        {newVendedor.nome ? getInitials(newVendedor.nome) : <Camera className="w-6 h-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="foto-upload"
                      />
                      <Label htmlFor="foto-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Escolher Foto
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddVendedor}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de Vendedores */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Empresa/Setor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tempo em Serviço</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.map((vendedor) => (
                  <TableRow key={vendedor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={vendedor.foto} />
                          <AvatarFallback className="text-xs">
                            {getInitials(vendedor.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{vendedor.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vendedor.empresa || 'Sucesso'}</TableCell>
                    <TableCell>{getStatusBadge(vendedor.status)}</TableCell>
                    <TableCell>
                      {vendedor.status === 'servico' && vendedor.tempoServico ? (
                        <span className="text-sm text-gray-600">
                          {Math.floor((Date.now() - vendedor.tempoServico) / (1000 * 60))} min
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditVendedor(vendedor)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteVendedor(vendedor.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={!!editingVendedor} onOpenChange={() => setEditingVendedor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Vendedor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome</Label>
                <Input
                  id="edit-nome"
                  placeholder="Nome do vendedor"
                  value={newVendedor.nome}
                  onChange={(e) => setNewVendedor(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-empresa">Empresa/Setor</Label>
                <Input
                  id="edit-empresa"
                  placeholder="Ex: Sucesso, Vendas, etc."
                  value={newVendedor.empresa}
                  onChange={(e) => setNewVendedor(prev => ({ ...prev, empresa: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Foto do Vendedor</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={newVendedor.foto} />
                    <AvatarFallback>
                      {newVendedor.nome ? getInitials(newVendedor.nome) : <Camera className="w-6 h-6" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="edit-foto-upload"
                    />
                    <Label htmlFor="edit-foto-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Alterar Foto
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingVendedor(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateVendedor}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminPanel

