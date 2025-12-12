import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Verifica se as chaves foram carregadas
if not url or not key:
    print("Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_KEY não definidas.")
    print("Certifique-se de ter um arquivo .env no diretório correto.")
    # Em um app real, você lançaria uma exceção aqui
    supabase: Client = None
else:
    # Cria o cliente Supabase
    supabase: Client = create_client(url, key)
    print("Cliente Supabase conectado com sucesso!")

# Você pode importar 'supabase' de outros arquivos para usá-lo