import { useSelector } from 'react-redux';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ProgressIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import propTypes from 'prop-types';
import { conversionStatuses, progress } from '../../utils/ConverterConstants';
import { useStyles } from './styles';

const SnetAdaEthSteps = ({ steps, activeStep }) => {
  const classes = useStyles();
  const { conversion } = useSelector((state) => state.tokenPairs.conversionOfAdaToEth);

  const isStepFailed = (step) => {
    if (conversion.status === conversionStatuses.EXPIRED) {
      return step === 1;
    }
    return null;
  };

  const stepperProgressIcon = (progressStatus) => {
    let icon;

    switch (progressStatus) {
      case progress.COMPLETE:
        icon = <DoneIcon />;
        break;

      case progress.ERROR:
        icon = <ErrorIcon />;
        break;

      case progress.PROCESSING:
        icon = <ProgressIcon />;
        break;

      default:
        icon = false;
        break;
    }

    return icon;
  };

  return (
    <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
      {steps.map(({ step, label, progress }) => {
        const labelProps = {};
        if (isStepFailed(step)) {
          labelProps.error = true;
        }
        return (
          <Step ste key={step}>
            <StepLabel icon={stepperProgressIcon(progress)} {...labelProps}>
              {label}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

SnetAdaEthSteps.propTypes = {
  steps: propTypes.arrayOf(propTypes.string).isRequired,
  activeStep: propTypes.number.isRequired,
  isBurning: propTypes.bool.isRequired
};

export default SnetAdaEthSteps;
