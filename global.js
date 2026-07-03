// global.js - traduções para vários idiomas  

document.addEventListener("DOMContentLoaded", () => {
  aplicarConfiguracoes();
  inicializarEventosConfiguracoes();
});

function aplicarConfiguracoes() {
  const tema = localStorage.getItem("tema") || "claro";
  const fonte = localStorage.getItem("fonte") || "normal";
  const idioma = localStorage.getItem("idioma") || "pt";
  const notificacao = localStorage.getItem("notificacao") || "push";
  aplicarTema(tema);
  aplicarFonte(fonte);
  aplicarIdioma(idioma);
  aplicarNotificacao(notificacao);
}

function inicializarEventosConfiguracoes() {
  document.querySelectorAll('input[name="tema"]').forEach(r => {
    r.checked = r.value === (localStorage.getItem("tema") || "claro");
    r.addEventListener("change", () => { localStorage.setItem("tema", r.value); aplicarTema(r.value); });
  });
  document.querySelectorAll('input[name="fonte"]').forEach(r => {
    r.checked = r.value === (localStorage.getItem("fonte") || "normal");
    r.addEventListener("change", () => { localStorage.setItem("fonte", r.value); aplicarFonte(r.value); });
  });
  const idiomaSelect = document.querySelector("#idiomaApp");
  if (idiomaSelect) {
    idiomaSelect.value = localStorage.getItem("idioma") || "pt";
    idiomaSelect.addEventListener("change", () => { 
      localStorage.setItem("idioma", idiomaSelect.value); 
      aplicarIdioma(idiomaSelect.value); 
    });
  }
  document.querySelectorAll('input[name="notificacao"]').forEach(r => {
    r.checked = r.value === (localStorage.getItem("notificacao") || "push");
    r.addEventListener("change", () => { localStorage.setItem("notificacao", r.value); aplicarNotificacao(r.value); });
  });
}

function aplicarTema(tema) {
  document.body.classList.remove("tema-claro","tema-escuro");
  if (tema==="escuro") document.body.classList.add("tema-escuro");
  else if (tema==="automatico") document.body.classList.add(window.matchMedia("(prefers-color-scheme: dark)").matches ? "tema-escuro":"tema-claro");
  else document.body.classList.add("tema-claro");
}

function aplicarFonte(fonte) {
  document.body.classList.remove("fonte-normal","fonte-grande","fonte-estilo");
  if (fonte==="grande") document.body.classList.add("fonte-grande");
  else if (fonte==="estilo") document.body.classList.add("fonte-estilo");
  else document.body.classList.add("fonte-normal");
}

// ---------------------------- TRADUÇÕES ----------------------------

const traducoes = {
  pt: {
    // login
    title:"VIP Android - Login", welcome:"Bem-vindo(a) à", vip_android:"VIP ANDROID", login_continue:"Faça login para continuar",
    email_label:"E-mail", password_label:"Senha", show_hide_password:"Mostrar ou esconder senha",
    login_button:"Entrar", login_google:"Entrar com Google", forgot_password:"Esqueci minha senha", create_account:"Criar conta",
    // app
    configuracoes:"Configurações", personalizacao:"Personalização", idioma:"Idioma", notificacoes:"Notificações", sobre:"Sobre o App", voltar:"⬅ Voltar ao Início",
    tema:"Tema", claro:"Claro", escuro:"Escuro", automatico:"Automático",
    fonte:"Fonte", normal:"Normal", grande:"Grande", estilo:"Estilizada",
    notificacao_tipo:"Tipo de Notificação", push:"Push", email:"E-mail", sms:"SMS",
    titulo_pagina:"Vip Android - Loja", selo_texto:"🛡️ Compra 100% Segura | 📦 Envio Rápido | 📱 Loja especializada em qualidade",
    buscar_placeholder:"Buscar por nome ou marca", todas_categorias:"Todas as categorias", config:"⚙️ Configurações", minha_conta:"👤 Minha Conta",
    menu_inicio:"🏠 Início", menu_ofertas:"🔥 Ofertas do Dia", menu_andamento:"🚚 Andamento da Entrega", menu_favoritos:"⭐ Favoritos", menu_avaliacoes:"📝 Avaliações",
    menu_painel:"📋 Painel da Loja", menu_ajuda:"❓ Ajuda", menu_contato:"📞 Contato", menu_carrinho:"🛒 Carrinho", menu_compartilhar:"📲 Compartilhar o App",
    menu_sair:"🚪 Sair", titulo_confianca:"🔒 Avaliação & Confiança", confianca_1:"✔️ Celulares novos e seminovos com nota fiscal",
    confianca_2:"✔️ Atendimento local com entrega rápida", confianca_3:"✔️ Produtos testados e verificados", confianca_4:"✔️ Loja com avaliações reais de clientes",
    og_titulo:"Vip Android - Loja", og_descricao:"Os melhores celulares novos e seminovos com garantia e preço justo.",
    // avaliações
    title_avaliacoes:"⭐ Avaliações - VIP Android", menu_avaliacoes_topo:"⭐ Avaliações", deixe_sua_avaliacao:"Deixe sua Avaliação",
    escreva_comentario:"Escreva seu comentário...", seu_nome_opcional:"Seu nome (opcional)", enviar_avaliacao:"Enviar Avaliação",
    avaliacoes_recentes:"📣 Avaliações Recentes",
    // andamento
    title_entrega: "Andamento da Entrega - Vip Android",
    consulta_entrega: "Consulta de Andamento da Entrega",
    voltar_inicio: "← Voltar para o início",
    digite_cpf: "Digite seu CPF:",
    cpf_placeholder: "Apenas números",
    consultar: "Consultar",
    resultado_titulo: "Resultado da Consulta",
    dados_entrega: "Informações da entrega:",
    status_entrega: "Status da entrega",
    erro_consulta: "Erro: CPF não encontrado ou inválido.",
    duvidas_contato: "Em caso de dúvidas, entre em contato com:",
    contato_loja: "Contato da Loja: +55 68 9245-1530",
    contato_proprietario: "Número do Proprietário: +55 68 9914-7048",
    // carrinho
    carrinho_titulo:"🛒 Seu Carrinho", carrinho_vazio:"Seu carrinho está vazio", carrinho_total:"Total:", carrinho_comprar:"Finalizar Compra",
    carrinho_remover_item:"Remover Item", carrinho_atualizar_quantidade:"Atualizar Quantidade", carrinho_continuar_comprando:"Continuar Comprando",
    //compartilhar
     title_compartilhar:"📲 Compartilhar - VIP Android", compartilhar_texto:"Compartilhe o VIP Android com seus amigos:",
     compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
     compartilhar_email:"✉️ E-mail", compartilhar_link:"🔗 Copiar Link", link_copiado:"✅ Link copiado com sucesso!",
    // confirmação
    title:"VIP Android - Confirmação", confirm_message:"Seu pedido foi realizado com sucesso!", order_number:"Número do Pedido", order_total:"Total do Pedido",
    order_details:"Detalhes do Pedido", payment_method:"Método de Pagamento", shipping_address:"Endereço de Entrega",
    continue_shopping:"Continuar Comprando", go_to_home:"⬅ Voltar ao Início",
    //ofertas
    title_ofertas: "🔥 Ofertas do Dia - VIP Android",
    titulo_pagina: "🔥 Ofertas do Dia",
    voltar_inicio: "← Voltar ao Início",
    menu_voltar_inicio: "🏠 Voltar ao Início",
    nenhuma_oferta: "Nenhuma oferta disponível no momento.",
    erro_carregar: "Erro ao carregar as ofertas. Tente novamente.",
    frete_gratis: "🚚 Frete Grátis"
  },

  en: {
    title:"VIP Android - Login", welcome:"Welcome to", vip_android:"VIP ANDROID", login_continue:"Please login to continue",
    email_label:"Email", password_label:"Password", show_hide_password:"Show or hide password",
    login_button:"Login", login_google:"Login with Google", forgot_password:"Forgot password", create_account:"Create account",
    configuracoes:"Settings", personalizacao:"Personalization", idioma:"Language", notificacoes:"Notifications", sobre:"About the App", voltar:"⬅ Back to Home",
    tema:"Theme", claro:"Light", escuro:"Dark", automatico:"Automatic",
    fonte:"Font", normal:"Normal", grande:"Large", estilo:"Stylized",
    notificacao_tipo:"Notification Type", push:"Push", email:"Email", sms:"SMS",
    titulo_pagina:"Vip Android - Store", selo_texto:"🛡️ 100% Secure Purchase | 📦 Fast Shipping | 📱 Quality-specialized Store",
    buscar_placeholder:"Search by name or brand", todas_categorias:"All Categories", config:"⚙️ Settings", minha_conta:"👤 My Account",
    menu_inicio:"🏠 Home", menu_ofertas:"🔥 Daily Deals", menu_andamento:"🚚 Delivery Status", menu_favoritos:"⭐ Favorites", menu_avaliacoes:"📝 Reviews",
    menu_painel:"📋 Store Dashboard", menu_ajuda:"❓ Help", menu_contato:"📞 Contact", menu_carrinho:"🛒 Cart", menu_compartilhar:"📲 Share App",
    menu_sair:"🚪 Logout", titulo_confianca:"🔒 Rating & Trust", confianca_1:"✔️ New and used phones with invoice",
    confianca_2:"✔️ Local service with fast delivery", confianca_3:"✔️ Tested and verified products", confianca_4:"✔️ Store with real customer reviews",
    og_titulo:"Vip Android - Store", og_descricao:"Best new and used phones with warranty and fair prices.",
    // reviews
    title_avaliacoes:"⭐ Reviews - VIP Android", menu_avaliacoes_topo:"⭐ Reviews", deixe_sua_avaliacao:"Leave your Review",
    escreva_comentario:"Write your comment...", seu_nome_opcional:"Your name (optional)", enviar_avaliacao:"Submit Review",
    avaliacoes_recentes:"📣 Recent Reviews",
    // delivery
    title_entrega: "Delivery Status - Vip Android",
    consulta_entrega: "Delivery Status Check",
    voltar_inicio: "← Back to Home",
    digite_cpf: "Enter your CPF:",
    cpf_placeholder: "Numbers only",
    consultar: "Check",
    resultado_titulo: "Check Result",
    dados_entrega: "Delivery information:",
    status_entrega: "Delivery status",
    erro_consulta: "Error: CPF not found or invalid.",
    duvidas_contato: "If you have questions, contact:",
    contato_loja: "Store Contact: +55 68 9245-1530",
    contato_proprietario: "Owner's Number: +55 68 9914-7048",
    // cart
    carrinho_titulo:"🛒 Your Cart", carrinho_vazio:"Your cart is empty", carrinho_total:"Total:", carrinho_comprar:"Checkout",
    carrinho_remover_item:"Remove Item", carrinho_atualizar_quantidade:"Update Quantity", carrinho_continuar_comprando:"Continue Shopping",
    //compartilhar
    title_compartilhar:"📲 Share - VIP Android", compartilhar_texto:"Share VIP Android with your friends:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ Email", compartilhar_link:"🔗 Copy Link", link_copiado:"✅ Link successfully copied!",
    // confirmation
    title:"VIP Android - Confirmation", confirm_message:"Your order has been successfully placed!", order_number:"Order Number", order_total:"Order Total",
    order_details:"Order Details", payment_method:"Payment Method", shipping_address:"Shipping Address",
    continue_shopping:"Continue Shopping", go_to_home:"⬅ Back to Home",
    //ofertas
    title_ofertas: "🔥 Daily Deals - VIP Android",
    titulo_pagina: "🔥 Daily Deals",
    voltar_inicio: "← Back to Home",
    menu_voltar_inicio: "🏠 Back to Home",
    nenhuma_oferta: "No offers available at the moment.",
    erro_carregar: "Error loading offers. Please try again.",
    frete_gratis: "🚚 Free Shipping"
  },

  es: {
    title:"VIP Android - Login", welcome:"Bienvenido(a) a", vip_android:"VIP ANDROID", login_continue:"Inicia sesión para continuar",
    email_label:"Correo", password_label:"Contraseña", show_hide_password:"Mostrar u ocultar contraseña",
    login_button:"Entrar", login_google:"Entrar con Google", forgot_password:"Olvidé mi contraseña", create_account:"Crear cuenta",
    configuracoes:"Configuraciones", personalizacao:"Personalización", idioma:"Idioma", notificacoes:"Notificaciones", sobre:"Sobre la App", voltar:"⬅ Volver al Inicio",
    tema:"Tema", claro:"Claro", escuro:"Oscuro", automatico:"Automático",
    fonte:"Fuente", normal:"Normal", grande:"Grande", estilo:"Estilizada",
    notificacao_tipo:"Tipo de Notificación", push:"Push", email:"Correo", sms:"SMS",
    titulo_pagina:"Vip Android - Tienda", selo_texto:"🛡️ Compra 100% Segura | 📦 Envío Rápido | 📱 Tienda especializada en calidad",
    buscar_placeholder:"Buscar por nombre o marca", todas_categorias:"Todas las categorías", config:"⚙️ Configuraciones", minha_conta:"👤 Mi Cuenta",
    menu_inicio:"🏠 Inicio", menu_ofertas:"🔥 Ofertas del Día", menu_andamento:"🚚 Estado de Entrega", menu_favoritos:"⭐ Favoritos", menu_avaliacoes:"📝 Reseñas",
    menu_painel:"📋 Panel de la Tienda", menu_ajuda:"❓ Ayuda", menu_contato:"📞 Contacto", menu_carrinho:"🛒 Carrito", menu_compartilhar:"📲 Compartir la App",
    menu_sair:"🚪 Salir", titulo_confianca:"🔒 Valoración & Confianza", confianca_1:"✔️ Teléfonos nuevos y usados con factura",
    confianca_2:"✔️ Atención local con entrega rápida", confianca_3:"✔️ Productos probados y verificados", confianca_4:"✔️ Tienda con reseñas reales de clientes",
    og_titulo:"Vip Android - Tienda", og_descricao:"Los mejores teléfonos nuevos y usados con garantía y precios justos.",
    // reseñas
    title_avaliacoes:"⭐ Reseñas - VIP Android", menu_avaliacoes_topo:"⭐ Reseñas", deixe_sua_avaliacao:"Deja tu Reseña",
    escreva_comentario:"Escribe tu comentario...", seu_nome_opcional:"Tu nombre (opcional)", enviar_avaliacao:"Enviar Reseña",
    avaliacoes_recentes:"📣 Reseñas Recientes",
    // entrega
    title_entrega: "Estado de la Entrega - Vip Android",
    consulta_entrega: "Consulta del Estado de Entrega",
    voltar_inicio: "← Volver al inicio",
    digite_cpf: "Ingrese su CPF:",
    cpf_placeholder: "Solo números",
    consultar: "Consultar",
    resultado_titulo: "Resultado de la Consulta",
    dados_entrega: "Información de la entrega:",
    status_entrega: "Estado de la entrega",
    erro_consulta: "Error: CPF no encontrado o inválido.",
    duvidas_contato: "Si tiene dudas, contacte a:",
    contato_loja: "Contacto de la Tienda: +55 68 9245-1530",
    contato_proprietario: "Número del Propietario: +55 68 9914-7048",
    // carrito
    carrinho_titulo:"🛒 Tu Carrito", carrinho_vazio:"Tu carrito está vacío", carrinho_total:"Total:", carrinho_comprar:"Pagar",
    carrinho_remover_item:"Eliminar Artículo", carrinho_atualizar_quantidade:"Actualizar Cantidad", carrinho_continuar_comprando:"Seguir Comprando",
    //compartilhar
    title_compartilhar:"📲 Compartir - VIP Android", compartilhar_texto:"Comparte VIP Android con tus amigos:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ Correo", compartilhar_link:"🔗 Copiar Enlace", link_copiado:"✅ ¡Enlace copiado con éxito!",
    // confirmación
    title:"VIP Android - Confirmación", confirm_message:"¡Su pedido se ha realizado con éxito!", order_number:"Número de Pedido", order_total:"Total del Pedido",
    order_details:"Detalles del Pedido", payment_method:"Método de Pago", shipping_address:"Dirección de Envío",
    continue_shopping:"Seguir Comprando", go_to_home:"⬅ Volver al Inicio",
   //ofertas
    title_ofertas: "🔥 Ofertas del Día - VIP Android",
    titulo_pagina: "🔥 Ofertas del Día",
    voltar_inicio: "← Volver al Inicio",
    menu_voltar_inicio: "🏠 Volver al Inicio",
    nenhuma_oferta: "No hay ofertas disponibles en este momento.",
    erro_carregar: "Error al cargar las ofertas. Inténtalo de nuevo.",
    frete_gratis: "🚚 Envío Gratis"
  },

  fr: {
    title:"VIP Android - Connexion", welcome:"Bienvenue à", vip_android:"VIP ANDROID", login_continue:"Connectez-vous pour continuer",
    email_label:"E-mail", password_label:"Mot de passe", show_hide_password:"Afficher ou masquer le mot de passe",
    login_button:"Se connecter", login_google:"Se connecter avec Google", forgot_password:"Mot de passe oublié", create_account:"Créer un compte",
    configuracoes:"Paramètres", personalizacao:"Personnalisation", idioma:"Langue", notificacoes:"Notifications", sobre:"À propos de l'application", voltar:"⬅ Retour à l'accueil",
    tema:"Thème", claro:"Clair", escuro:"Sombre", automatico:"Automatique",
    fonte:"Police", normal:"Normale", grande:"Grande", estilo:"Stylisée",
    notificacao_tipo:"Type de notification", push:"Push", email:"E-mail", sms:"SMS",
    titulo_pagina:"Vip Android - Boutique", selo_texto:"🛡️ Achat 100% Sécurisé | 📦 Livraison Rapide | 📱 Boutique spécialisée en qualité",
    buscar_placeholder:"Rechercher par nom ou marque", todas_categorias:"Toutes les catégories", config:"⚙️ Paramètres", minha_conta:"👤 Mon Compte",
    menu_inicio:"🏠 Accueil", menu_ofertas:"🔥 Offres du jour", menu_andamento:"🚚 Suivi de livraison", menu_favoritos:"⭐ Favoris", menu_avaliacoes:"📝 Avis",
    menu_painel:"📋 Tableau de bord", menu_ajuda:"❓ Aide", menu_contato:"📞 Contact", menu_carrinho:"🛒 Panier", menu_compartilhar:"📲 Partager l'application",
    menu_sair:"🚪 Déconnexion", titulo_confianca:"🔒 Évaluation & Confiance", confianca_1:"✔️ Téléphones neufs et reconditionnés avec facture",
    confianca_2:"✔️ Service local avec livraison rapide", confianca_3:"✔️ Produits testés et vérifiés", confianca_4:"✔️ Avis clients authentiques",
    og_titulo:"Vip Android - Boutique", og_descricao:"Les meilleurs téléphones neufs et reconditionnés avec garantie et prix justes.",
    // avis
    title_avaliacoes:"⭐ Avis - VIP Android", menu_avaliacoes_topo:"⭐ Avis", deixe_sua_avaliacao:"Laissez votre Avis",
    escreva_comentario:"Écrivez votre commentaire...", seu_nome_opcional:"Votre nom (optionnel)", enviar_avaliacao:"Envoyer l'Avis",
    avaliacoes_recentes:"📣 Avis Récents",
    // livraison
     title_entrega: "Suivi de Livraison - Vip Android",
    consulta_entrega: "Vérification du Suivi de Livraison",
    voltar_inicio: "← Retour à l'accueil",
    digite_cpf: "Entrez votre CPF :",
    cpf_placeholder: "Seulement les chiffres",
    consultar: "Vérifier",
    resultado_titulo: "Résultat de la Vérification",
    dados_entrega: "Informations sur la livraison :",
    status_entrega: "Statut de la livraison",
    erro_consulta: "Erreur : CPF introuvable ou invalide.",
    duvidas_contato: "En cas de questions, contactez :",
    contato_loja: "Contact du magasin : +55 68 9245-1530",
    contato_proprietario: "Numéro du propriétaire : +55 68 9914-7048",
    // panier
    carrinho_titulo:"🛒 Votre Panier", carrinho_vazio:"Votre panier est vide", carrinho_total:"Total :", carrinho_comprar:"Passer à la Caisse",
    carrinho_remover_item:"Supprimer l'Article", carrinho_atualizar_quantidade:"Mettre à Jour la Quantité", carrinho_continuar_comprando:"Continuer vos Achats",
    //compartilhar
    title_compartilhar:"📲 Partager - VIP Android", compartilhar_texto:"Partagez VIP Android avec vos amis :",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ E-mail", compartilhar_link:"🔗 Copier le lien", link_copiado:"✅ Lien copié avec succès !",
    // confirmation
    title:"VIP Android - Confirmation", confirm_message:"Votre commande a été passée avec succès !", order_number:"Numéro de Commande", order_total:"Total de la Commande",
    order_details:"Détails de la Commande", payment_method:"Méthode de Paiement", shipping_address:"Adresse de Livraison",
    continue_shopping:"Continuer vos Achats", go_to_home:"⬅ Retour à l'Accueil",
   //ofertas
    title_ofertas: "🔥 Offres du Jour - VIP Android",
    titulo_pagina: "🔥 Offres du Jour",
    voltar_inicio: "← Retour à l'accueil",
    menu_voltar_inicio: "🏠 Retour à l'accueil",
    nenhuma_oferta: "Aucune offre disponible pour le moment.",
    erro_carregar: "Erreur lors du chargement des offres. Veuillez réessayer.",
    frete_gratis: "🚚 Livraison Gratuite"
  },

  de: {
    title:"VIP Android - Anmeldung", welcome:"Willkommen bei", vip_android:"VIP ANDROID", login_continue:"Bitte melden Sie sich an, um fortzufahren",
    email_label:"E-Mail", password_label:"Passwort", show_hide_password:"Passwort anzeigen/ausblenden",
    login_button:"Anmelden", login_google:"Mit Google anmelden", forgot_password:"Passwort vergessen", create_account:"Konto erstellen",
    configuracoes:"Einstellungen", personalizacao:"Personalisierung", idioma:"Sprache", notificacoes:"Benachrichtigungen", sobre:"Über die App", voltar:"⬅ Zurück zur Startseite",
    tema:"Thema", claro:"Hell", escuro:"Dunkel", automatico:"Automatisch",
    fonte:"Schriftart", normal:"Normal", grande:"Groß", estilo:"Stilisiert",
    notificacao_tipo:"Benachrichtigungstyp", push:"Push", email:"E-Mail", sms:"SMS",
    titulo_pagina:"Vip Android - Shop", selo_texto:"🛡️ 100% Sicherer Kauf | 📦 Schneller Versand | 📱 Qualitätsshop",
    buscar_placeholder:"Nach Name oder Marke suchen", todas_categorias:"Alle Kategorien", config:"⚙️ Einstellungen", minha_conta:"👤 Mein Konto",
    menu_inicio:"🏠 Startseite", menu_ofertas:"🔥 Tagesangebote", menu_andamento:"🚚 Lieferstatus", menu_favoritos:"⭐ Favoriten", menu_avaliacoes:"📝 Bewertungen",
    menu_painel:"📋 Shop-Dashboard", menu_ajuda:"❓ Hilfe", menu_contato:"📞 Kontakt", menu_carrinho:"🛒 Warenkorb", menu_compartilhar:"📲 App teilen",
    menu_sair:"🚪 Abmelden", titulo_confianca:"🔒 Bewertung & Vertrauen", confianca_1:"✔️ Neue und gebrauchte Handys mit Rechnung",
    confianca_2:"✔️ Lokaler Service mit schneller Lieferung", confianca_3:"✔️ Getestete und geprüfte Produkte", confianca_4:"✔️ Echte Kundenbewertungen",
    og_titulo:"Vip Android - Shop", og_descricao:"Die besten neuen und gebrauchten Handys mit Garantie und fairen Preisen.",
    // bewertungen
    title_avaliacoes:"⭐ Bewertungen - VIP Android", menu_avaliacoes_topo:"⭐ Bewertungen", deixe_sua_avaliacao:"Hinterlassen Sie Ihre Bewertung",
    escreva_comentario:"Schreiben Sie Ihren Kommentar...", seu_nome_opcional:"Ihr Name (optional)", enviar_avaliacao:"Bewertung absenden",
    avaliacoes_recentes:"📣 Neueste Bewertungen",
    // lieferung
    title_entrega: "Lieferstatus - Vip Android",
    consulta_entrega: "Lieferstatus Abfrage",
    voltar_inicio: "← Zur Startseite",
    digite_cpf: "Geben Sie Ihre CPF ein:",
    cpf_placeholder: "Nur Zahlen",
    consultar: "Abfragen",
    resultado_titulo: "Abfrageergebnis",
    dados_entrega: "Lieferinformationen:",
    status_entrega: "Lieferstatus",
    erro_consulta: "Fehler: CPF nicht gefunden oder ungültig.",
    duvidas_contato: "Bei Fragen kontaktieren Sie:",
    contato_loja: "Shop-Kontakt: +55 68 9245-1530",
    contato_proprietario: "Nummer des Eigentümers: +55 68 9914-7048",
    // warenkorb
    carrinho_titulo:"🛒 Ihr Warenkorb", carrinho_vazio:"Ihr Warenkorb ist leer", carrinho_total:"Gesamt:", carrinho_comprar:"Zur Kasse",
    carrinho_remover_item:"Artikel Entfernen", carrinho_atualizar_quantidade:"Menge Aktualisieren", carrinho_continuar_comprando:"Weiter Einkaufen",
    //compartilhar
    title_compartilhar:"📲 Teilen - VIP Android", compartilhar_texto:"Teilen Sie VIP Android mit Ihren Freunden:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ E-Mail", compartilhar_link:"🔗 Link kopieren", link_copiado:"✅ Link erfolgreich kopiert!",
     // bestätigung
    title:"VIP Android - Bestätigung", confirm_message:"Ihre Bestellung wurde erfolgreich aufgegeben!", order_number:"Bestellnummer", order_total:"Bestellwert",
    order_details:"Bestelldetails", payment_method:"Zahlungsmethode", shipping_address:"Lieferadresse",
    continue_shopping:"Weiter Einkaufen", go_to_home:"⬅ Zur Startseite",
    //ofertas 
    title_ofertas: "🔥 Tagesangebote - VIP Android",
    titulo_pagina: "🔥 Tagesangebote",
    voltar_inicio: "← Zurück zur Startseite",
    menu_voltar_inicio: "🏠 Zurück zur Startseite",
    nenhuma_oferta: "Zurzeit keine Angebote verfügbar.",
    erro_carregar: "Fehler beim Laden der Angebote. Bitte erneut versuchen.",
    frete_gratis: "🚚 Kostenloser Versand"
  },

  it: {
    title:"VIP Android - Accesso", welcome:"Benvenuto/a in", vip_android:"VIP ANDROID", login_continue:"Accedi per continuare",
    email_label:"Email", password_label:"Password", show_hide_password:"Mostra o nascondi password",
    login_button:"Accedi", login_google:"Accedi con Google", forgot_password:"Password dimenticata", create_account:"Crea account",
    configuracoes:"Impostazioni", personalizacao:"Personalizzazione", idioma:"Lingua", notificacoes:"Notifiche", sobre:"Informazioni sull'app", voltar:"⬅ Torna alla Home",
    tema:"Tema", claro:"Chiaro", escuro:"Scuro", automatico:"Automatico",
    fonte:"Carattere", normal:"Normale", grande:"Grande", estilo:"Stilizzato",
    notificacao_tipo:"Tipo di notifica", push:"Push", email:"Email", sms:"SMS",
    titulo_pagina:"Vip Android - Negozio", selo_texto:"🛡️ Acquisto 100% Sicuro | 📦 Spedizione Veloce | 📱 Negozio specializzato in qualità",
    buscar_placeholder:"Cerca per nome o marca", todas_categorias:"Tutte le categorie", config:"⚙️ Impostazioni", minha_conta:"👤 Il mio account",
    menu_inicio:"🏠 Inizio", menu_ofertas:"🔥 Offerte del Giorno", menu_andamento:"🚚 Stato della Consegna", menu_favoritos:"⭐ Preferiti", menu_avaliacoes:"📝 Recensioni",
    menu_painel:"📋 Pannello del Negozio", menu_ajuda:"❓ Aiuto", menu_contato:"📞 Contatto", menu_carrinho:"🛒 Carrello", menu_compartilhar:"📲 Condividi App",
    menu_sair:"🚪 Esci", titulo_confianca:"🔒 Valutazione & Fiducia", confianca_1:"✔️ Telefoni nuovi e usati con fattura",
    confianca_2:"✔️ Servizio locale con consegna rapida", confianca_3:"✔️ Prodotti testati e verificati", confianca_4:"✔️ Recensioni reali dei clienti",
    og_titulo:"Vip Android - Negozio", og_descricao:"I migliori telefoni nuovi e usati con garanzia e prezzi equi.",
    // recensioni
    title_avaliacoes:"⭐ Recensioni - VIP Android", menu_avaliacoes_topo:"⭐ Recensioni", deixe_sua_avaliacao:"Lascia la tua Recensione",
    escreva_comentario:"Scrivi il tuo commento...", seu_nome_opcional:"Il tuo nome (opzionale)", enviar_avaliacao:"Invia Recensione",
    avaliacoes_recentes:"📣 Recensioni Recenti",
    // consegna
    title_entrega: "Stato della Consegna - Vip Android",
    consulta_entrega: "Controllo Stato Consegna",
    voltar_inicio: "← Torna alla Home",
    digite_cpf: "Inserisci il tuo CPF:",
    cpf_placeholder: "Solo numeri",
    consultar: "Controlla",
    resultado_titulo: "Risultato della Verifica",
    dados_entrega: "Informazioni sulla consegna:",
    status_entrega: "Stato della consegna",
    erro_consulta: "Errore: CPF non trovato o non valido.",
    duvidas_contato: "In caso di dubbi, contatta:",
    contato_loja: "Contatto del Negozio: +55 68 9245-1530",
    contato_proprietario: "Numero del Proprietario: +55 68 9914-7048",
    // carrello
    carrinho_titulo:"🛒 Il tuo Carrello", carrinho_vazio:"Il tuo carrello è vuoto", carrinho_total:"Totale:", carrinho_comprar:"Procedi al pagamento",
    carrinho_remover_item:"Rimuovi Articolo", carrinho_atualizar_quantidade:"Aggiorna Quantità", carrinho_continuar_comprando:"Continua Acquisti",
    //compartilhar
    title_compartilhar:"📲 Condividi - VIP Android", compartilhar_texto:"Condividi VIP Android con i tuoi amici:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ Email", compartilhar_link:"🔗 Copia Link", link_copiado:"✅ Link copiato con successo!",
    // conferma
    title:"VIP Android - Conferma", confirm_message:"Il tuo ordine è stato completato con successo!", order_number:"Numero Ordine", order_total:"Totale Ordine",
    order_details:"Dettagli Ordine", payment_method:"Metodo di Pagamento", shipping_address:"Indirizzo di Spedizione",
    continue_shopping:"Continua Acquisti", go_to_home:"⬅ Torna alla Home",
    //ofertas 
    title_ofertas: "🔥 Offerte del Giorno - VIP Android",
    titulo_pagina: "🔥 Offerte del Giorno",
    voltar_inicio: "← Torna alla Home",
    menu_voltar_inicio: "🏠 Torna alla Home",
    nenhuma_oferta: "Nessuna offerta disponibile al momento.",
    erro_carregar: "Errore durante il caricamento delle offerte. Riprova.",
    frete_gratis: "🚚 Spedizione Gratuita"
  },

  ja: {
    title:"VIP Android - ログイン", welcome:"ようこそ", vip_android:"VIP ANDROID", login_continue:"続行するにはログインしてください",
    email_label:"メール", password_label:"パスワード", show_hide_password:"パスワードを表示/非表示",
    login_button:"ログイン", login_google:"Googleでログイン", forgot_password:"パスワードを忘れた", create_account:"アカウント作成",
    configuracoes:"設定", personalizacao:"カスタマイズ", idioma:"言語", notificacoes:"通知", sobre:"アプリについて", voltar:"⬅ ホームへ戻る",
    tema:"テーマ", claro:"ライト", escuro:"ダーク", automatico:"自動",
    fonte:"フォント", normal:"通常", grande:"大きい", estilo:"スタイリッシュ",
    notificacao_tipo:"通知タイプ", push:"プッシュ", email:"メール", sms:"SMS",
    titulo_pagina:"Vip Android - ストア", selo_texto:"🛡️ 100% 安全な購入 | 📦 高速配送 | 📱 高品質専門店",
    buscar_placeholder:"名前またはブランドで検索", todas_categorias:"すべてのカテゴリ", config:"⚙️ 設定", minha_conta:"👤 マイアカウント",
    menu_inicio:"🏠 ホーム", menu_ofertas:"🔥 本日の特価", menu_andamento:"🚚 配送状況", menu_favoritos:"⭐ お気に入り", menu_avaliacoes:"📝 レビュー",
    menu_painel:"📋 ストア管理", menu_ajuda:"❓ ヘルプ", menu_contato:"📞 お問い合わせ", menu_carrinho:"🛒 カート", menu_compartilhar:"📲 アプリを共有",
    menu_sair:"🚪 ログアウト", titulo_confianca:"🔒 評価 & 信頼", confianca_1:"✔️ 新品・中古携帯電話（領収書付き）",
    confianca_2:"✔️ 地域サービスと迅速な配送", confianca_3:"✔️ テスト済み・認証済み製品", confianca_4:"✔️ 実際のお客様レビュー",
    og_titulo:"Vip Android - ストア", og_descricao:"保証と公正な価格で最高の新品・中古携帯電話。",
    // レビュー
    title_avaliacoes:"⭐ レビュー - VIP Android", menu_avaliacoes_topo:"⭐ レビュー", deixe_sua_avaliacao:"レビューを残す",
    escreva_comentario:"コメントを書く...", seu_nome_opcional:"お名前（任意）", enviar_avaliacao:"レビューを送信",
    avaliacoes_recentes:"📣 最近のレビュー",
    // 配送
    title_entrega: "配達状況 - Vip Android",
    consulta_entrega: "配達状況の確認",
    voltar_inicio: "← ホームに戻る",
    digite_cpf: "CPFを入力してください：",
    cpf_placeholder: "数字のみ",
    consultar: "確認",
    resultado_titulo: "確認結果",
    dados_entrega: "配達情報：",
    status_entrega: "配達状況",
    erro_consulta: "エラー：CPFが見つからないか無効です。",
    duvidas_contato: "ご不明な点があれば、お問い合わせください：",
    contato_loja: "店舗連絡先: +55 68 9245-1530",
    contato_proprietario: "オーナー番号: +55 68 9914-7048",
    // カート
    carrinho_titulo:"🛒 カート", carrinho_vazio:"カートは空です", carrinho_total:"合計:", carrinho_comprar:"購入手続き",
    carrinho_remover_item:"アイテムを削除", carrinho_atualizar_quantidade:"数量を更新", carrinho_continuar_comprando:"買い物を続ける",
    //compartilhar
    title_compartilhar:"📲 共有 - VIP Android", compartilhar_texto:"VIP Android を友達と共有しましょう:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ メール", compartilhar_link:"🔗 リンクをコピー", link_copiado:"✅ リンクを正常にコピーしました！",
    // 確認
    title:"VIP Android - 確認", confirm_message:"ご注文が正常に完了しました！", order_number:"注文番号", order_total:"注文合計",
    order_details:"注文詳細", payment_method:"支払い方法", shipping_address:"配送先住所",
    continue_shopping:"買い物を続ける", go_to_home:"⬅ ホームへ戻る",
    //ofertas 
    title_ofertas: "🔥 本日の特価 - VIP Android",
    titulo_pagina: "🔥 本日の特価",
    voltar_inicio: "← ホームに戻る",
    menu_voltar_inicio: "🏠 ホームに戻る",
    nenhuma_oferta: "現在利用可能なオファーはありません。",
    erro_carregar: "オファーの読み込み中にエラーが発生しました。もう一度お試しください。",
    frete_gratis: "🚚 送料無料",
  },

  zh: {
    title:"VIP Android - 登录", welcome:"欢迎来到", vip_android:"VIP ANDROID", login_continue:"请登录以继续",
    email_label:"邮箱", password_label:"密码", show_hide_password:"显示或隐藏密码",
    login_button:"登录", login_google:"使用 Google 登录", forgot_password:"忘记密码", create_account:"创建账户",
    configuracoes:"设置", personalizacao:"个性化", idioma:"语言", notificacoes:"通知", sobre:"关于应用", voltar:"⬅ 返回首页",
    tema:"主题", claro:"浅色", escuro:"深色", automatico:"自动",
    fonte:"字体", normal:"正常", grande:"大号", estilo:"艺术",
    notificacao_tipo:"通知类型", push:"推送", email:"邮箱", sms:"短信",
    titulo_pagina:"Vip Android - 商店", selo_texto:"🛡️ 100% 安全购买 | 📦 快速发货 | 📱 专业品质商店",
    buscar_placeholder:"按名称或品牌搜索", todas_categorias:"所有类别", config:"⚙️ 设置", minha_conta:"👤 我的账户",
    menu_inicio:"🏠 首页", menu_ofertas:"🔥 每日优惠", menu_andamento:"🚚 配送状态", menu_favoritos:"⭐ 收藏夹", menu_avaliacoes:"📝 评论",
    menu_painel:"📋 商店面板", menu_ajuda:"❓ 帮助", menu_contato:"📞 联系我们", menu_carrinho:"🛒 购物车", menu_compartilhar:"📲 分享应用",
    menu_sair:"🚪 退出", titulo_confianca:"🔒 评价 & 信任", confianca_1:"✔️ 新旧手机（附发票）",
    confianca_2:"✔️ 本地服务和快速交付", confianca_3:"✔️ 已测试和验证的产品", confianca_4:"✔️ 真实客户评价",
    og_titulo:"Vip Android - 商店", og_descricao:"提供保修和合理价格的最佳新旧手机。",
    // 评论
    title_avaliacoes:"⭐ 评论 - VIP Android", menu_avaliacoes_topo:"⭐ 评论", deixe_sua_avaliacao:"留下您的评论",
    escreva_comentario:"写下您的评论...", seu_nome_opcional:"您的姓名（可选）", enviar_avaliacao:"提交评论",
    avaliacoes_recentes:"📣 最新评论",
    // 配送
    title_entrega: "配送状态 - Vip Android",
    consulta_entrega: "配送状态查询",
    voltar_inicio: "← 返回首页",
    digite_cpf: "请输入您的CPF：",
    cpf_placeholder: "仅限数字",
    consultar: "查询",
    resultado_titulo: "查询结果",
    dados_entrega: "配送信息：",
    status_entrega: "配送状态",
    erro_consulta: "错误：未找到CPF或无效。",
    duvidas_contato: "如有疑问，请联系：",
    contato_loja: "商店联系方式: +55 68 9245-1530",
    contato_proprietario: "店主号码: +55 68 9914-7048",
    // 购物车
    carrinho_titulo:"🛒 购物车", carrinho_vazio:"您的购物车为空", carrinho_total:"总计:", carrinho_comprar:"结算",
    carrinho_remover_item:"移除商品", carrinho_atualizar_quantidade:"更新数量", carrinho_continuar_comprando:"继续购物",
    //compartilhar
    title_compartilhar:"📲 分享 - VIP Android", compartilhar_texto:"与朋友分享 VIP Android：",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ 邮件", compartilhar_link:"🔗 复制链接", link_copiado:"✅ 链接复制成功！",
    // 确认
    title:"VIP Android - 确认", confirm_message:"您的订单已成功提交！", order_number:"订单号", order_total:"订单总额",
    order_details:"订单详情", payment_method:"付款方式", shipping_address:"送货地址",
    continue_shopping:"继续购物", go_to_home:"⬅ 返回首页",
    //ofertas 
    title_ofertas: "🔥 今日优惠 - VIP Android",
    titulo_pagina: "🔥 今日优惠",
    voltar_inicio: "← 返回首页",
    menu_voltar_inicio: "🏠 返回首页",
    nenhuma_oferta: "目前没有可用的优惠。",
    erro_carregar: "加载优惠时出错。请重试。",
    frete_gratis: "🚚 免费送货"
  },

  ar: {
    title:"VIP Android - تسجيل الدخول", welcome:"مرحبًا بك في", vip_android:"VIP ANDROID", login_continue:"الرجاء تسجيل الدخول للمتابعة",
    email_label:"البريد الإلكتروني", password_label:"كلمة المرور", show_hide_password:"إظهار أو إخفاء كلمة المرور",
    login_button:"تسجيل الدخول", login_google:"تسجيل الدخول باستخدام Google", forgot_password:"نسيت كلمة المرور", create_account:"إنشاء حساب",
    configuracoes:"الإعدادات", personalizacao:"التخصيص", idioma:"اللغة", notificacoes:"الإشعارات", sobre:"حول التطبيق", voltar:"⬅ العودة إلى الصفحة الرئيسية",
    tema:"الوضع", claro:"فاتح", escuro:"داكن", automatico:"تلقائي",
    fonte:"الخط", normal:"عادي", grande:"كبير", estilo:"مزخرف",
    notificacao_tipo:"نوع الإشعار", push:"إشعار", email:"بريد إلكتروني", sms:"رسالة نصية",
    titulo_pagina:"Vip Android - المتجر", selo_texto:"🛡️ شراء آمن 100% | 📦 شحن سريع | 📱 متجر متخصص بالجودة",
    buscar_placeholder:"ابحث بالاسم أو العلامة التجارية", todas_categorias:"جميع الفئات", config:"⚙️ الإعدادات", minha_conta:"👤 حسابي",
    menu_inicio:"🏠 الرئيسية", menu_ofertas:"🔥 عروض اليوم", menu_andamento:"🚚 حالة التوصيل", menu_favoritos:"⭐ المفضلة", menu_avaliacoes:"📝 المراجعات",
    menu_painel:"📋 لوحة المتجر", menu_ajuda:"❓ المساعدة", menu_contato:"📞 اتصل بنا", menu_carrinho:"🛒 سلة التسوق", menu_compartilhar:"📲 مشاركة التطبيق",
    menu_sair:"🚪 تسجيل الخروج", titulo_confianca:"🔒 التقييم & الثقة", confianca_1:"✔️ هواتف جديدة ومستعملة مع فاتورة",
    confianca_2:"✔️ خدمة محلية مع توصيل سريع", confianca_3:"✔️ منتجات مختبرة وموثوقة", confianca_4:"✔️ مراجعات حقيقية من العملاء",
    og_titulo:"Vip Android - المتجر", og_descricao:"أفضل الهواتف الجديدة والمستعملة مع ضمان وأسعار عادلة.",
    // المراجعات
    title_avaliacoes:"⭐ المراجعات - VIP Android", menu_avaliacoes_topo:"⭐ المراجعات", deixe_sua_avaliacao:"اترك مراجعتك",
    escreva_comentario:"اكتب تعليقك...", seu_nome_opcional:"اسمك (اختياري)", enviar_avaliacao:"إرسال المراجعة",
    avaliacoes_recentes:"📣 أحدث المراجعات",
    // التوصيل
    title_entrega: "حالة التسليم - Vip Android",
    consulta_entrega: "التحقق من حالة التسليم",
    voltar_inicio: "← العودة إلى الصفحة الرئيسية",
    digite_cpf: "أدخل CPF الخاص بك:",
    cpf_placeholder: "أرقام فقط",
    consultar: "تحقق",
    resultado_titulo: "نتيجة التحقق",
    dados_entrega: "معلومات التسليم:",
    status_entrega: "حالة التسليم",
    erro_consulta: "خطأ: لم يتم العثور على CPF أو غير صالح.",
    duvidas_contato: "في حال وجود استفسارات، تواصل مع:",
    contato_loja: "اتصال المتجر: +55 68 9245-1530",
    contato_proprietario: "رقم المالك: +55 68 9914-7048",
    // سلة التسوق
    carrinho_titulo:"🛒 سلة التسوق", carrinho_vazio:"سلتك فارغة", carrinho_total:"الإجمالي:", carrinho_comprar:"إتمام الدفع",
    carrinho_remover_item:"إزالة المنتج", carrinho_atualizar_quantidade:"تحديث الكمية", carrinho_continuar_comprando:"متابعة التسوق",
    //compartilhar
    title_compartilhar:"📲 مشاركة - VIP Android", compartilhar_texto:"شارك VIP Android مع أصدقائك:",
    compartilhar_whatsapp:"📱 واتساب", compartilhar_facebook:"📘 فيسبوك", compartilhar_twitter:"🐦 تويتر",
    compartilhar_email:"✉️ بريد إلكتروني", compartilhar_link:"🔗 نسخ الرابط", link_copiado:"✅ تم نسخ الرابط بنجاح!",
    // التأكيد
    title:"VIP Android - تأكيد", confirm_message:"تم تنفيذ طلبك بنجاح!", order_number:"رقم الطلب", order_total:"إجمالي الطلب",
    order_details:"تفاصيل الطلب", payment_method:"طريقة الدفع", shipping_address:"عنوان الشحن",
    continue_shopping:"متابعة التسوق", go_to_home:"⬅ العودة إلى الصفحة الرئيسية",
    //ofertas 
    title_ofertas: "🔥 عروض اليوم - VIP Android",
    titulo_pagina: "🔥 عروض اليوم",
    voltar_inicio: "← العودة إلى الصفحة الرئيسية",
    menu_voltar_inicio: "🏠 العودة إلى الصفحة الرئيسية",
    nenhuma_oferta: "لا توجد عروض متاحة حالياً.",
    erro_carregar: "حدث خطأ أثناء تحميل العروض. حاول مرة أخرى.",
    frete_gratis: "🚚 شحن مجاني"
  },

  ru: {
    title:"VIP Android - Вход", welcome:"Добро пожаловать в", vip_android:"VIP ANDROID", login_continue:"Пожалуйста, войдите, чтобы продолжить",
    email_label:"Эл. почта", password_label:"Пароль", show_hide_password:"Показать/скрыть пароль",
    login_button:"Войти", login_google:"Войти через Google", forgot_password:"Забыли пароль?", create_account:"Создать аккаунт",
    configuracoes:"Настройки", personalizacao:"Персонализация", idioma:"Язык", notificacoes:"Уведомления", sobre:"О приложении", voltar:"⬅ Назад на главную",
    tema:"Тема", claro:"Светлая", escuro:"Темная", automatico:"Автоматическая",
    fonte:"Шрифт", normal:"Обычный", grande:"Крупный", estilo:"Стилизованный",
    notificacao_tipo:"Тип уведомления", push:"Push", email:"Эл. почта", sms:"SMS",
    titulo_pagina:"Vip Android - Магазин", selo_texto:"🛡️ 100% Безопасная покупка | 📦 Быстрая доставка | 📱 Магазин качества",
    buscar_placeholder:"Поиск по имени или бренду", todas_categorias:"Все категории", config:"⚙️ Настройки", minha_conta:"👤 Мой аккаунт",
    menu_inicio:"🏠 Главная", menu_ofertas:"🔥 Предложения дня", menu_andamento:"🚚 Статус доставки", menu_favoritos:"⭐ Избранное", menu_avaliacoes:"📝 Отзывы",
    menu_painel:"📋 Панель магазина", menu_ajuda:"❓ Помощь", menu_contato:"📞 Контакты", menu_carrinho:"🛒 Корзина", menu_compartilhar:"📲 Поделиться приложением",
    menu_sair:"🚪 Выйти", titulo_confianca:"🔒 Оценка & Доверие", confianca_1:"✔️ Новые и подержанные телефоны с чеком",
    confianca_2:"✔️ Локальное обслуживание и быстрая доставка", confianca_3:"✔️ Проверенные и протестированные товары", confianca_4:"✔️ Реальные отзывы клиентов",
    og_titulo:"Vip Android - Магазин", og_descricao:"Лучшие новые и подержанные телефоны с гарантией и справедливой ценой.",
    // отзывы
    title_avaliacoes:"⭐ Отзывы - VIP Android", menu_avaliacoes_topo:"⭐ Отзывы", deixe_sua_avaliacao:"Оставьте свой отзыв",
    escreva_comentario:"Напишите свой комментарий...", seu_nome_opcional:"Ваше имя (необязательно)", enviar_avaliacao:"Отправить отзыв",
    avaliacoes_recentes:"📣 Последние отзывы",
    // доставка
    title_entrega: "Статус доставки - Vip Android",
    consulta_entrega: "Проверка статуса доставки",
    voltar_inicio: "← На главную",
    digite_cpf: "Введите ваш CPF:",
    cpf_placeholder: "Только цифры",
    consultar: "Проверить",
    resultado_titulo: "Результат проверки",
    dados_entrega: "Информация о доставке:",
    status_entrega: "Статус доставки",
    erro_consulta: "Ошибка: CPF не найден или недействителен.",
    duvidas_contato: "Если есть вопросы, свяжитесь с:",
    contato_loja: "Контакт магазина: +55 68 9245-1530",
    contato_proprietario: "Номер владельца: +55 68 9914-7048",
    // корзина
    carrinho_titulo:"🛒 Корзина", carrinho_vazio:"Ваша корзина пуста", carrinho_total:"Итого:", carrinho_comprar:"Перейти к оплате",
    carrinho_remover_item:"Удалить товар", carrinho_atualizar_quantidade:"Обновить количество", carrinho_continuar_comprando:"Продолжить покупки",
    //compartilhar
    title_compartilhar:"📲 Поделиться - VIP Android", compartilhar_texto:"Поделитесь VIP Android с друзьями:",
    compartilhar_whatsapp:"📱 WhatsApp", compartilhar_facebook:"📘 Facebook", compartilhar_twitter:"🐦 Twitter",
    compartilhar_email:"✉️ Электронная почта", compartilhar_link:"🔗 Копировать ссылку", link_copiado:"✅ Ссылка успешно скопирована!",
    // подтверждение
    title:"VIP Android - Подтверждение", confirm_message:"Ваш заказ успешно оформлен!", order_number:"Номер заказа", order_total:"Сумма заказа",
    order_details:"Детали заказа", payment_method:"Способ оплаты", shipping_address:"Адрес доставки",
    continue_shopping:"Продолжить покупки", go_to_home:"⬅ На главную",
    //ofertas
    title_ofertas: "🔥 Акции дня - VIP Android",
    titulo_pagina: "🔥 Акции дня",
    voltar_inicio: "← Назад на главную",
    menu_voltar_inicio: "🏠 Назад на главную",
    nenhuma_oferta: "На данный момент нет доступных предложений.",
    erro_carregar: "Ошибка при загрузке предложений. Попробуйте еще раз.",
    frete_gratis: "🚚 Бесплатная доставка"
  },
};

// ---------------------------- APLICA IDIOMA ----------------------------

function aplicarIdioma(idioma) {
  const textos = traducoes[idioma] || traducoes["pt"];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const chave = el.getAttribute("data-i18n");
    if (textos[chave]) el.textContent = textos[chave];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const chave = el.getAttribute("data-i18n-placeholder");
    if (textos[chave]) el.setAttribute("placeholder", textos[chave]);
  });
  if (textos.titulo_pagina) document.title = textos.titulo_pagina;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle && textos.og_titulo) ogTitle.setAttribute("content", textos.og_titulo);
  if (ogDesc && textos.og_descricao) ogDesc.setAttribute("content", textos.og_descricao);
}

function aplicarNotificacao(tipo) { console.log("Notificação:", tipo); }
