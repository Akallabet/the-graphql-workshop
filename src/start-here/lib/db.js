import sql from '@nearform/sql'

export async function getPets(db) {
  const { rows } = await db.query(sql`SELECT * FROM pets`)
  return rows
}

export async function getOwnersByPets(db, petNames) {
  const query = sql`
    SELECT owners.* FROM owners
    INNER JOIN pets ON pets.owner = owners.id
    AND pets.name = ANY(${petNames})
  `
  const { rows } = await db.query(query)
  return rows
}
