import React from 'react';
import { Row, Col } from 'antd';

interface CollapseBoxButtonProps {
  onChange: React.MouseEventHandler<HTMLDivElement>;
  title: React.ReactNode;
}

const CollapseBoxButton: React.FC<CollapseBoxButtonProps> = ({ onChange, title }) => {
  return (
    <div className="collapseBoxHeader" onClick={onChange}>
      {title}
    </div>
  );
};

interface CollapseBoxPanelProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const TopCollapseBox: React.FC<CollapseBoxPanelProps> = ({ isOpen, children }) => {
  const show: React.CSSProperties = isOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return (
    <div className="TopCollapseBox">
      <div style={show}>
        <Row>
          <Col span={24}> {children}</Col>
        </Row>
      </div>
    </div>
  );
};

const BottomCollapseBox: React.FC<CollapseBoxPanelProps> = ({ isOpen, children }) => {
  const show: React.CSSProperties = isOpen ? { display: 'none', opacity: 0 } : { display: 'block', opacity: 1 };
  return (
    <div className="BottomCollapseBox">
      <div style={show}>
        <Row>
          <Col span={24}> {children}</Col>
        </Row>
      </div>
    </div>
  );
};

interface CollapseBoxProps {
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  buttonTitle: React.ReactNode;
  isCollapsed: boolean;
  onCollapse: React.MouseEventHandler<HTMLDivElement>;
}

export default function CollapseBox({
  topContent,
  bottomContent,
  buttonTitle,
  isCollapsed,
  onCollapse,
}: CollapseBoxProps): React.JSX.Element {
  const collapsed: string = isCollapsed ? 'collapsed' : '';
  return (
    <>
      <TopCollapseBox isOpen={isCollapsed}>{topContent}</TopCollapseBox>
      <div className={'collapseBox ' + collapsed}>
        <CollapseBoxButton title={buttonTitle} onChange={onCollapse} />
        <div className="whiteBg"></div>
        <BottomCollapseBox isOpen={isCollapsed}>{bottomContent}</BottomCollapseBox>
      </div>
    </>
  );
}
