import { Form, Field, defineRule, ErrorMessage, configure } from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  min_value,
  max_value,
  confirmed,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', Form)
    app.component('VeeField', Field)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alpha_spaces)
    defineRule('email', email)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)
    defineRule('password_mismatch', confirmed)
    defineRule('excluded', excluded)
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: 'Знаю, что не хочется... Но надо!(грусный смайлик)',
          min: `Маловато будет`,
          max: `Не лень было печатать?)`,
          alpha_spaces: 'А буквами слабо?',
          email: 'Ну же, ты сможешь, а в тебя верю!',
          min_value: `Вечно молодой, вечно пьяный`,
          max_value: `Вы стар... вы очень стар... Вы просто Супер-Стар!`,
          excluded: `Вы не можете использовать это значение для поля ${ctx.field}`,
          password_mismatch: `Введенный email не совпадает`,
          tos: 'Там, кстати, интересно написано. Рекомендую!'
        }
        const massage = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `Поле ${ctx.field} недействительно`
        return massage
      }
    })
  }
}
