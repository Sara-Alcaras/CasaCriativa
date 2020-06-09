// express pra criar e configurar o servidor
const express = require("express")
const server = express()

const db = require("./db")

// const ideas = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description:"Dar o próximo passo na sua evolução como programador, potencialize o seu aprendizado e destaque-se entre os programadores.",
//     url: "https://www.rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//     title: "Exercícios",
//     category: "Saúde",
//     description: "Levar uma vida sedentária é uma das principais causas das mortes prematuras na sociedade. A melhor forma de prevenir doenças, fugir dos remédios, ter uma saúde mental em dia e levar uma vida plena é colocar seu corpo em movimento.",
//     url: "https://bt.fit/pt/#/"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//     title: "Meditação",
//     category: "Mentalidade",
//     description: "A meditação reduz o estresse e a ansiedade fortalecendo o sistema nervoso e imunológico, melhora a memória, a autoestima e aumenta a capacidade de concentração.",
//     url: "https://www.headspace.com/pt"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//     title: "Karaokê",
//     category: "Diversão em Família",
//     description: "Se você é daquelas pessoas que curtem cantar músicas boas (ou nem tanto) e divertidas com os amigos e familia, o karaokê é uma ótima opção.",
//     url: "https://www.versao-karaoke.com/karaoke_free/karaoke.html"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/1158/1158164.svg",
//     title: "Pintura",
//     category: "Criatividade",
//     description: "Os desenhos podem ser dos mais simples aos mais complexos, logo você poderá passar alguns minutos ou até mesmo horas colorindo.",
//     url: "https://www.mona.com.br/"
//   },
//   {
//     img: "https://www.flaticon.com/premium-icon/icons/svg/2729/2729790.svg",
//     title: "Skin care",
//     category: "Beleza",
//     description: "Um conjunto de cuidados com a pela é muito importante para garantir uma pele saudável e a autoestima elevada.",
//     url: "https://blogcatharinehill.com.br/dicas/skincare-confira-5-dicas-para-incluir-essa-rotina-no-seu-dia-dia/"
//   },
// ]

//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

// configuração nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true,
})

// criar uma rota / capturar o pedido do cliente para responder
server.get("/", function(req, res) {

  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    // Regra de negócio - Pegar as ultimas ideias e reverter
    for (let idea of reversedIdeas) {
      if(lastIdeas.length < 2) {
        lastIdeas.push(idea)
      }
    }

    return res.render("index.html", { ideas: lastIdeas })
  })

})

server.get("/ideias", function(req, res) {
  db.all(`SELECT * FROM ideas`, function(err, rows) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reversedIdeas = [...rows].reverse()
    return res.render("ideias.html", { ideas: reversedIdeas })
  })
})

server.post("/", function(req, res) {
  // Inserir dado na tabela
  const query = `
      INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
      ) VALUES (?,?,?,?,?);
    `
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link,
  ]

  db.run(query, values, function(err) {
    if (err) {
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    return res.redirect("/ideias")
  })

})

// liguei meu servidor na porta 3000
server.listen(3000)