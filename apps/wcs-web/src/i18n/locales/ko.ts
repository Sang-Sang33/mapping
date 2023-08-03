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
    instanceList: {
      nav: '실행 기록'
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
    extraProperties: '추가 속성',
    action: '액션',
    debugMode: '디버그 모드',
    open: '열기',
    close: '닫기',
    create: '생성',
    edit: '편집',
    detail: '세부 정보',
    complete: '완료',
    cancel: '취소',
    createSubMission: '하위 미션 생성',
    createMissionSuccess: '미션 생성 성공',
    editMissionSuccess: '미션 편집 성공',
    createSubMissionSuccess: '하위 미션 생성 성공',
    editSubMissionSuccess: '하위 미션 편집 성공',
    completeMissionSuccess: '미션 완료 성공',
    cancelMissionSuccess: '미션 취소 성공'
  },
  rcsMission: {
    status: '상태',
    id: '미션 ID',
    predecessorIds: '이전 미션',
    priority: '우선순위',
    to: '도착지',
    vehicles: '호출 차량',
    height: '높이',
    declineHeight: '하강 높이',
    liftHeight: '상승 높이',
    creationTime: '생성 시간',
    lastModificationTime: '최종 수정 시간',
    extraProperties: '추가 속성',
    action: '액션',
    detail: '세부 정보'
  },
  missionProcess: {
    title: '미션 처리',
    addDialog: {
      name: '미션 이름'
    }
  },
  empty: '데이터 없음'
}

export default ko
