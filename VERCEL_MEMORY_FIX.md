# 🔧 Correção: Limite de Memória do Vercel

## ❌ Problema Identificado

O erro ocorreu porque a memória configurada (`3008 MB`) estava **acima do limite permitido** pelo Vercel.

## 📊 Limites de Memória do Vercel

Conforme a [documentação oficial](https://vercel.com/docs/functions/configuring-functions/memory):

| Plano | Memória Padrão | Memória Máxima |
|-------|---------------|----------------|
| **Hobby** | 2 GB (2048 MB) | 2 GB (2048 MB) - **Fixo, não ajustável** |
| **Pro** | 2 GB (2048 MB) | 4 GB (4096 MB) - Configurável |
| **Enterprise** | 2 GB (2048 MB) | 4 GB (4096 MB) - Configurável |

## ✅ Correção Aplicada

**Antes:**
```json
{
  "functions": {
    "api/index.js": {
      "memory": 3008,  // ❌ INVÁLIDO - acima do limite
      "maxDuration": 30
    }
  }
}
```

**Depois:**
```json
{
  "functions": {
    "api/index.js": {
      "memory": 2048,  // ✅ VÁLIDO - funciona em todos os planos
      "maxDuration": 30
    }
  }
}
```

## 🎯 Por que 2048 MB?

1. **Compatibilidade**: Funciona em **todos os planos** (Hobby, Pro, Enterprise)
2. **Limite Hobby**: É o máximo permitido no plano Hobby (gratuito)
3. **Suficiente**: 2 GB é suficiente para a maioria das aplicações Express

## 💡 Se Você Estiver no Plano Pro

Se você tiver plano **Pro** e precisar de mais memória, pode aumentar para até **4096 MB**:

```json
{
  "functions": {
    "api/index.js": {
      "memory": 4096,  // Máximo para Pro/Enterprise
      "maxDuration": 30
    }
  }
}
```

**⚠️ Atenção:** Aumentar memória também aumenta o custo, pois o Vercel cobra baseado em GB-segundo.

## 📝 Valores Válidos de Memória

O Vercel aceita os seguintes valores (em MB):
- `1024` (1 GB)
- `1152`
- `1280`
- `1408`
- `1536`
- `1664`
- `1792`
- `1920`
- `2048` (2 GB) - **Padrão e máximo para Hobby**
- `2304`
- `2560`
- `2816`
- `3072`
- `3328`
- `3584`
- `3840`
- `4096` (4 GB) - **Máximo para Pro/Enterprise**

## 🚀 Próximos Passos

1. ✅ **Memória corrigida** para 2048 MB
2. 🔄 **Faça deploy novamente** no Vercel
3. ✅ **Deve funcionar agora!**

## 📚 Referências

- [Vercel Functions Memory Configuration](https://vercel.com/docs/functions/configuring-functions/memory)
- [Vercel Limits Documentation](https://vercel.com/docs/limits)
