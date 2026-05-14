import { fonts } from '../../styles/tokens';

//eslint-disable-next-line
export default function PageHeader({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#E8F5E9' }}
        >
          <Icon className="w-5 h-5" style={{ color: '#009933' }} />
        </div>
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#009933', fontFamily: fonts.heading }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: '#666666' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
