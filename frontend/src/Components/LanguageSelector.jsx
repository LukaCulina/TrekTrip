import { FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 70 }}>
      <Select
        value={localStorage.getItem('language')}
        onChange={handleChange}
        displayEmpty
        variant="outlined"
      >
        <MenuItem value="hr">HR</MenuItem>
        <MenuItem value="en">EN</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
