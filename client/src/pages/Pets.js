import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const ALL_PETS_QUERY = gql`
    query AllPets {
        pets {
          name
          id
          type
          img
        }
    }
  `
const ADD_PET_MUTATION = gql`
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
` 

export default function Pets () {
  const [modal, setModal] = useState(false)
  const {data, loading, error} = useQuery(ALL_PETS_QUERY)
  const [createPet, newPet] = useMutation(ADD_PET_MUTATION, {
    update(cache, { data:  { addPet }}) {
      const { pets } = cache.readQuery({query: ALL_PETS_QUERY})
      cache.writeQuery({query: ALL_PETS_QUERY, data: {pets: [...pets, addPet]} })
    }
  })

  const onSubmit = newPet => {
    setModal(false);
    createPet({
      variables: {newPet}
    })
  }
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  if(loading || newPet.loading) {
    return <Loader />
  }

  if(error || newPet.error) {
    return <p>error</p>
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets}/>
      </section>
    </div>
  )
}
