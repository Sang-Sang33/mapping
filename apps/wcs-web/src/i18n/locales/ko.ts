const ko = {
  system: 'WCS 지능형 창고 제어 시스템',
  aside: {
    wmsMission: {
      nav: 'WMS 미션'
    },
    rcsMission: {
      nav: 'RCS 미션'
    },
    missionProcess: {
      nav: '미션 처리'
    },
    device: {
      nav: '장치',
      feature: {
        nav: '기능'
      },
      status: {
        nav: '상태'
      }
    },
    event: {
      nav: '이벤트'
    },
    logs: {
      nav: '로그'
    }
  },
  wmsMission: {
    status: '상태',
    id: '미션 ID',
    predecessorIds: '선행 미션',
    priority: '우선순위',
    from: '출발지',
    to: '도착지',
    autoRun: '자동 실행',
    autoAbort: '자동 중지',
    creationTime: '생성 시간',
    lastModificationTime: '최종 수정 시간',
    extraProperties: '추가 속성'
  },
  rcsMission: {
    status: '상태',
    id: '미션 ID',
    predecessorIds: '선행 미션',
    priority: '우선순위',
    vehicles: '호출 차량',
    creationTime: '생성 시간',
    lastModificationTime: '최종 수정 시간',
    extraProperties: '추가 속성'
  },
  missionProcess: {
    title: '미션 처리',
    addDialog: {
      name: '미션 이름'
    }
  }
}

export default ko
