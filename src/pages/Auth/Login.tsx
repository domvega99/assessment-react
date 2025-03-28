import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserErrors } from '../../interfaces/user-error.interface';
import { AppContext } from '../../context/AppContext';


const Login = () => {
    const { setToken } = useContext(AppContext) as any;
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<UserErrors>({});

    async function handleLogin(e: any) {
        e.preventDefault(); 
        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log(data)

        if (data.errors) {
            setErrors(data.errors)
        } else {
            setCookie('token', data.token);
            setToken(data.token)
            navigate("/");
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Card sx={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
                <h1>Login Account</h1>
                <form onSubmit={handleLogin} style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {errors.name && <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'red' }}>{errors.name[0]}</Typography>}
                    <TextField 
                        value={formData.email} 
                        type="text" 
                        label="Email" 
                        variant="outlined" 
                        fullWidth
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {errors.email && <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'red' }}>{errors.email[0]}</Typography>}
                    <TextField 
                        value={formData.password} 
                        type='password' 
                        label="Password" 
                        variant="outlined" 
                        fullWidth
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    {errors.password && <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'red' }}>{errors.password[0]}</Typography>}
        
                    <Button type='submit' variant='contained'> Sign In </Button>
                </form>
            </Card>
        </Box>
    )
}

export default Login
