| Order | Action                               | Layer                      |
| ----- | ------------------------------------ | -------------------------- |
| 1º    | Definir o método na Interface (port) | core/domain                |
| 2º    | Criar o novo Caso de Uso             | core/application           |
| 3º    | Implementar a lógica no Repositório  | infrastructure/persistence |
| 4º    | Criar o Endpoint no Controller       | infrastructure/http        |
