import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from "@material-ui/core/Button"
import FormGroup from '@material-ui/core/FormGroup'

export default function Selector(props) {
    const [facilities, setFacilities] = React.useState({
        "Seattle Children's Hospital": false,
        "Overlake Medical Center & Clinics": false,
        "Sunrise Senior Living: Bellevue": false,
        "Sunrise Senior Living: Mercer Island": false,
        "Harborview Medical Center": false,
        "Island House Assisted Living": false,
        "Virginia Mason Hospital and Seattle Medical Center": false,
        "EvergreenHealth Medical Center" : false,
        "Mary's Place Seattle": false,
        "Noel Women's House": false,
        "Aloha Inn": false,
        "Sacred Heart": false,
        "Swedish First Hill": false,
        "UW Medical Center: Montlake": false,
        "Swedish First HIll": false

      });    
      
     const [checked, setChecked] = React.useState({
        "approvalOnly": false,
        "unsentOnly": false
    })

    const handleChange = (event) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked });
    };

    const handleFacilities = (event) => {
        setFacilities({...facilities, [event.target.name]: event.target.checked})
    }

    const handleSearch = (event) => {
        props.callBack(facilities, checked)
        console.log(facilities)
    }


    return (
        <div style={{width: "50%", padding:10}}>
            <h1>Support Notes For Frontliners PDF Automation</h1>
            <br />
            <br />
            <h3>Select the Facility</h3>
            
            {Object.keys(facilities).map((facilityName) =>(
                <FormControlLabel key={facilityName} label={facilityName} control={<Checkbox onChange={handleFacilities} name={facilityName} />}/>
            ))}
            
            
            <h3>Filters</h3>
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={checked.approvalOnly} onChange={handleChange} name="approvalOnly" />}
                    label="Approved Only"
                />
                <FormControlLabel
                    control={<Switch checked={checked.unsentOnly} onChange={handleChange} name="unsentOnly" />}
                    label="Unsent Only"
                />
            </FormGroup>

            <Button onClick={handleSearch}>Search</Button>

        </div>
    )
}