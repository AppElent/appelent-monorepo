import PropTypes from 'prop-types';
import { MenuItem, TextField, Box } from '@mui/material';
import { useEffect } from 'react';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import { SatisfactoryCurrentVersion, satisfactoryVersions } from 'src/custom/libs/satisfactory';
import { useQueryParam } from 'use-query-params';

const VersionSelector = ({ sx }) => {
  const [savedVersion, setSavedVersion] = useLocalStorage('satisfactory_version');
  const [version, setVersion] = useQueryParam(
    'version'
    //withDefault(StringParam, savedVersion || SatisfactoryCurrentVersion)
  );
  useEffect(() => {
    const savedVersionCorrect = !!satisfactoryVersions.find((v) => v.key === savedVersion);
    if (!version) setVersion(savedVersionCorrect ? savedVersion : SatisfactoryCurrentVersion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return (
    <Box>
      <TextField
        defaultValue={version}
        label="Version"
        name="version"
        onChange={(event) => {
          setVersion(event.target.value);
          setSavedVersion(event.target.value);
        }}
        select
        sx={{ minWidth: 150, input: { color: 'var(--nav-item-color)' } }}
        InputProps={{
          sx: { color: 'var(--nav-item-color)' },
        }}
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

VersionSelector.propTypes = {
  sx: PropTypes.any,
};

export default VersionSelector;
