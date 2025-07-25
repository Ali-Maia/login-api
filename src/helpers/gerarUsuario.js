const { faker } = require('@faker-js/faker')

const gerarUsuario = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const usuario = {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ prefix: '123' })
  }
  return usuario
}

module.exports = gerarUsuario