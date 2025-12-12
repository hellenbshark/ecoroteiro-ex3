from supabase_client import supabase # Importa o cliente que você já configurou
import sys

def check_connection():
    if supabase is None:
        print("🔴 Falha: Cliente Supabase não foi inicializado.")
        print("   Verifique seu arquivo .env e o supabase_client.py.")
        sys.exit(1) # Encerra o script com erro

    try:
        print("Conectando ao Supabase para buscar tabelas...")
        
        # Este é o comando de teste:
        # Pedimos ao Supabase (PostgREST) para listar suas próprias tabelas
        response = supabase.table('locais').select('*').limit(0).execute()
        
        # Se a conexão falhou (chave errada, url errada), 
        # o 'response' vai conter um erro.
        # Se funcionou, 'response.data' vai existir (mesmo que seja uma lista vazia).

        if response.data is not None:
            print("\n=============================================")
            print("🟢 SUCESSO! A conexão foi estabelecida.")
            print("   Sua URL e Chave ANON estão corretas.")
            print("=============================================")
        else:
            # Isso pode acontecer se houver um erro de permissão ou outro
            print("\n=================================================")
            print("🟡 ATENÇÃO: A conexão funcionou, mas houve um erro.")
            print(f"   Mensagem: {response.error.message if response.error else 'Erro desconhecido'}")
            print("=================================================")


    except Exception as e:
        print("\n=======================================================")
        print(f"🔴 FALHA NA CONEXÃO. Erro: {e}")
        print("   Verifique sua URL, Chave ou conexão com a internet.")
        print("=======================================================")

# Roda a função de checagem
if __name__ == "__main__":
    check_connection()

