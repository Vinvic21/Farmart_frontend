import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '../../store/store'
import LoginPage from './LoginPage'

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    )
    
    // Tafuta button tu, sio label
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    
    // Tafuta input fields
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })
})