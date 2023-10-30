export const formFields = [
  {
    label: 'Имя',
    name: 'name',
    type: 'text',
    placeholder: 'Введите имя'
  },
  {
    label: 'Почта',
    name: 'email',
    type: 'text',
    placeholder: 'Введите почту'
  },
  {
    label: 'Возраст',
    name: 'age',
    type: 'number',
    placeholder: null
  },
  {
    label: 'Пароль',
    name: 'password',
    type: 'password',
    placeholder: 'Введите пароль'
  },
  {
    label: 'Подтвердите пароль',
    name: 'confirm_password',
    type: 'password',
    placeholder: 'Подтвердите пароль'
  }
]

export const schema = {
  name: 'required|min:3|max:20|alpha_spaces',
  email: 'required|max:30|email',
  age: 'required|min_value:12|max_value:100',
  password: 'required|min:7|max:20',
  confirm_password: 'password_mismatch:@password',
  tos: 'required'
}
