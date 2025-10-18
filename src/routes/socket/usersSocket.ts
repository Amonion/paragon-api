import { ISocketData } from '../../utils/teamInterface'

export const UsersSocket = async (data: ISocketData) => {
  switch (data.action) {
    case 'visit':
      console.log(data.data)
      break
    default:
      break
  }
}
