import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserErrors } from '../../interfaces/user-error.interface';
import { AppContext } from '../../context/AppContext';


const Register = () => {
    const { token, setToken } = useContext(AppContext) as any;
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [errors, setErrors] = useState<UserErrors>({});

    async function handleRegister(e: any) {
        e.preventDefault(); 
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        const data = await res.json();

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
                <h1>Register User Account</h1>
                <form onSubmit={handleRegister} style={{ width: "100%", display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField 
                        value={formData.name} 
                        type="text" 
                        label="Name" 
                        variant="outlined" 
                        fullWidth
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
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
                    <TextField 
                        value={formData.password_confirmation} 
                        type='password' 
                        label="Confirm Password" 
                        variant="outlined" 
                        fullWidth
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                    />
                    <Button type='submit' variant='contained'> Register </Button>
                </form>
            </Card>
        </Box>
    )
}

export default Register
