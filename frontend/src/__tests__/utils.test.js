describe('Utility Functions', () => {
  describe('formatSalary', () => {
    const formatSalary = (salary) => {
      return salary || 'Salary not specified';
    };

    test('returns formatted salary when salary exists', () => {
      expect(formatSalary('15,000 - 20,000 PLN')).toBe('15,000 - 20,000 PLN');
      expect(formatSalary('$50,000')).toBe('$50,000');
    });

    test('returns default message when salary is null or undefined', () => {
      expect(formatSalary(null)).toBe('Salary not specified');
      expect(formatSalary(undefined)).toBe('Salary not specified');
      expect(formatSalary('')).toBe('Salary not specified');
    });
  });

  describe('getJobTypeColor', () => {
    const getJobTypeColor = (type) => {
      switch (type) {
        case 'Full-time': return 'primary';
        case 'Part-time': return 'secondary';
        case 'Contract': return 'warning';
        default: return 'default';
      }
    };

    test('returns correct color for job types', () => {
      expect(getJobTypeColor('Full-time')).toBe('primary');
      expect(getJobTypeColor('Part-time')).toBe('secondary');
      expect(getJobTypeColor('Contract')).toBe('warning');
      expect(getJobTypeColor('Internship')).toBe('default');
    });
  });
});
