import { MenuItem, TextField, Box } from '@mui/material';
import { useEffect } from 'react';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import { SatisfactoryCurrentVersion, satisfactoryVersions } from 'src/custom/libs/satisfactory';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

const VersionSelector = ({ sx }) => {
  const [savedVersion, setSavedVersion] = useLocalStorage('satisfactory_version');
  const [version, setVersion] = useQueryParam(
    'version'
    //withDefault(StringParam, savedVersion || SatisfactoryCurrentVersion)
  );
  useEffect(() => {
    const savedVersionCorrect = !!satisfactoryVersions.find((v) => v.key === savedVersion);
    if (!version) setVersion(savedVersionCorrect ? savedVersion : SatisfactoryCurrentVersion);
  }, [version]);

  return (
    <Box sx={sx}>
      <TextField
        defaultValue={version}
        label="Version"
        name="version"
        onChange={(event) => {
          setVersion(event.target.value);
          setSavedVersion(event.target.value);
        }}
        select
        sx={{ minWidth: 150 }}
        value={version || SatisfactoryCurrentVersion}
      >
        {satisfactoryVersions.map((satisfactoryVersion) => (
          <MenuItem
            key={satisfactoryVersion.key}
            value={satisfactoryVersion.key}
          >
            {satisfactoryVersion.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default VersionSelector;
