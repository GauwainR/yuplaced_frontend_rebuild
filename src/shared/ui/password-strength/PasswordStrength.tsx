import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getStrengthBarClass,
  type PasswordStrength,
} from '../../../entities/auth/model/passwordStrength';

type PasswordStrengthProps = {
  strength: PasswordStrength;
};

export function PasswordStrength({ strength }: PasswordStrengthProps) {
  return (
    <div className="password-strength">
      {[0, 1, 2].map((index) => <div className={getStrengthBarClass(strength, index)} key={index} />)}
      <span className="strength-label" style={{ color: getPasswordStrengthColor(strength) }}>
        {getPasswordStrengthLabel(strength)}
      </span>
    </div>
  );
}
