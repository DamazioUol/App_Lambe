
App Lambe - Rede social baseada no Instagram
   
   O desenvolvimento do mesmo teve como base um curso de React Native e com isso o app foi desenvolvido como um "projeto de conclusão" do curso que decidi fazer.

   O app possui funcionalidades de gereciamento de dados do usuário:
      * Login
      * Recuperação de conta via email
      * Registro de usuário
      * Apagar conta
      * Logout
   
   E funcinalidades referente a publicações de imagem:
      * Criação com descrição
      * Apagar publicação
      * Curtir publicações
      * Comentar
      * Acessar lista de comentários
      * Apagar comentários


- Comandos usados para rodar a aplicação

   Inicia a aplicação react native
   npm start

   Instala o app no device android
   npm run android


- Gerar APK

   npx react-native bundle --platform android --dev false --entry-file index.js 
   --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

   ** Se der erro de assets/index.adroid.bundle é porque durante o start do projeto a pasta 'assets' não é criada.
   Então é só criar a pasta e rodar o comando novamente.

   Depois do sucesso do primeiro comando, rodar o comando:

   - cd android
   - ./gradlew assembleDebug

Em caso de dúvidas referente ao projeto enviar email para "lucasdamazio123@hotmail.com"